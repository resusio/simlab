import _ from "underscore";

import labTests from './builtins/labTests';
import { labTestGenerateMethod, labTestType } from "./types/labTestTypes";

/**
 * A dependency graph node, containing a list of references to child nodes and a name
 */
interface DependencyNode {
  name: string;
  edges: DependencyNode[];
};

/**
 * Takes a list of requested lab tests, then builds and solves a dependency
 * graph to ensure that the labs are solved in the correct order. Calculated
 * labs that depend on other labs have to be computed after the dependee labs
 * have been calculated
 * @param {string[]} labTestIds A list of all of the individual lab test IDs that will be processed
 * @returns {string[]} A list of the same individual lab test IDs in the correct order for solving.
 */
export function createOrderedLabList(labTestIds: string[]): string[] {
  // Build the dependency graph, then re-order the lab calculations to fit this
  let nodeList: DependencyNode[] = [];
  labTestIds.forEach((labTestId) => {
    const labTestConfig = labTests.find((test) => test.id === labTestId);
    if (!labTestConfig) return; //Ignore labs that don't exist

    if (labTestConfig.generate.method === labTestGenerateMethod.DERIVED) {
      // If it is a calculated node, check if it has any dependencies and build the graph
      const nodeGraph = createDependencyNode(labTestConfig, labTestIds);
      nodeList.push(nodeGraph);
    } else {
      // Not a calculated node, so by definition no dependencies
      nodeList.push({ name: labTestId, edges: [] });
    }
  });

  // Now walk the tree to generate the computation order
  let orderedLabList: string[] = [];
  nodeList.forEach((node) => {
    const result = createDependencyOrderedList(node);

    // Iterate on result and only add tests not already in the ordereList
    result.forEach((lab) => {
      if (!_.contains(orderedLabList, lab)) orderedLabList.push(lab);
    });
  });

  return orderedLabList;
};

/**
 * Recursively builds a dependency sub-graph for the provided lab test ID.
 * @param {string} labId Lab test ID of the lab test that a dependency subgraph is currently being built for.
 * @param {string[]} requestedLabs List of all requested labs, to avoid duplication
 * @returns {DependencyNode} The top-level node of the dependency subgraph relating to this lab test ID.
 */
function createDependencyNode (lab: labTestType, requestedLabs: string[]): DependencyNode {
  let edges: DependencyNode[] = [];

  if (lab.generate.method === labTestGenerateMethod.DERIVED) {
    if (lab.generate.requires) {
      // This test has other tests it depends on
      lab.generate.requires.forEach((requiredLabId) => {
        // Find the lab config object, then pass recursively to make its dependency tree (e.g. derived lab depending on a derived lab, etc.)
        const requiredLabConfig = labTests.find((labTest) => labTest.id === requiredLabId);
        if (requiredLabConfig) // Ignore if it doesn't exist
          edges.push(createDependencyNode(requiredLabConfig, requestedLabs)); // Push child nodes on for each test it depends on
      });
    }

    // Make sure that we include any lab that a default is provided for, only if it has been requested (otherwise it
    // may end up after the depending lab and will use the default rather than the calculated value.)
    if (lab.generate.defaults) {
      lab.generate.defaults.forEach((defaultLab) => {
        if (_.contains(requestedLabs, defaultLab.id)) {
          // Find this lab config object and pass it recursively
          const defaultLabConfig = labTests.find((labTest) => labTest.id === defaultLab.id);
          if (defaultLabConfig)
            edges.push(createDependencyNode(defaultLabConfig, requestedLabs));
        }
      });
    }
  }

  // Create and return a node object
  return {
    name: lab.id,
    edges
  };
};

/**
 * Recursively traverses the dependency graph and flattens it into an ordered list of lab test IDs
 * @param {DependencyNode} node The current node of the dependency graph that is being traversed
 * @param {string} node.name The ID of the current node lab test
 * @param {DependencyNode[]} node.edges List of child nodes of this one (i.e. the lab tests upon which the current node's lab test depends)
 * @param {string[]} A list of labs in order that they need to be computed.
 */
function createDependencyOrderedList (node: DependencyNode): string[] {
  if (node.edges && node.edges.length > 0) {
    const edges = node.edges.map((childNode) =>
      createDependencyOrderedList(childNode)
    ); // Recur through child edges
    // Now create an array [edges, node] - order is important so that dependees go before the current test
    return _.flatten([...edges, node.name]);
  } else {
    // No children, return it's own name
    return [node.name];
  }
};

export default createOrderedLabList;
