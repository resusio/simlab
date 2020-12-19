import _ from 'underscore';
import { labTestGenerateMethod, labTestType } from './types/labTestTypes';

/**
 * A dependency graph node, containing a list of references to child nodes and a name for the node
 */
export interface DependencyNode {
  labTest: labTestType;
  edges: DependencyNode[];
}

/**
 * Recursively builds a dependency sub-graph for the provided lab test.
 * @param lab Lab test ID of the lab test that a dependency subgraph is currently being built for.
 * @param requestedLabs Array of all requested labs, to avoid duplication.
 * @param labTestDb Database of all available lab tests to the generator.
 * @returns The top-level node of the dependency subgraph relating to this lab test.
 */
function createDependencyNode(
  lab: labTestType,
  requestedLabs: labTestType[],
  labTestDb: labTestType[]
): DependencyNode {
  let edges: DependencyNode[] = [];

  if (lab.generate.method === labTestGenerateMethod.DERIVED) {
    if (lab.generate.requires) {
      // This test has other tests it depends on
      lab.generate.requires.forEach((requiredLabId) => {
        // Find the lab config object, then pass recursively to make its dependency tree (e.g. derived lab depending on a derived lab, etc.)
        const requiredLabConfig = labTestDb.find(
          (checkLabTest) => checkLabTest.id === requiredLabId
        );
        if (requiredLabConfig)
          // Ignore if it doesn't exist
          edges.push(createDependencyNode(requiredLabConfig, requestedLabs, labTestDb)); // Push child nodes on for each test it depends on
      });
    }
  }

  // Create and return a node object
  return {
    labTest: lab,
    edges
  };
}

/**
 * Recursively traverses the dependency graph and flattens it into an ordered list of lab tests
 * @param node The current node of the dependency graph that is being traversed
 * @returns Array of lab tests in the order that they should be computed so that
 * derived tests always have the tests that they depend on available.
 */
function createDependencyOrderedList(node: DependencyNode): labTestType[] {
  if (node.edges && node.edges.length > 0) {
    const edges = node.edges.map((childNode) => createDependencyOrderedList(childNode)); // Recur through child edges
    // Now create an array [edges, node] - order is important so that dependees go before the current test
    return _.flatten([...edges, node.labTest]);
  } else {
    // No children, return it's own name
    return [node.labTest];
  }
}

/**
 * Takes a list of requested lab tests, then builds and solves a dependency
 * graph to ensure that the labs are solved in the correct order. Dependent
 * labs that depend on other labs have to be computed after the dependee labs
 * have been calculated
 * @param labTests Array of all of the individual lab tests that will be processed
 * @param labTestDb Array of all of the lab tests that are available (used to look up
 * required tests that are not part of the requested set)
 * @returns Array of the same individual lab tests in the correct order for solving.
 */
export function orderLabTestsByDependency(
  requestedLabTests: labTestType[],
  labTestDb: labTestType[]
): labTestType[] {
  // Build the dependency graph, then re-order the lab calculations to fit this
  let nodeList: DependencyNode[] = [];
  requestedLabTests.forEach((requestedLabTest) => {
    if (requestedLabTest.generate.method === labTestGenerateMethod.DERIVED) {
      // If it is a calculated node, check if it has any dependencies and build the graph
      const nodeGraph = createDependencyNode(requestedLabTest, requestedLabTests, labTestDb);
      nodeList.push(nodeGraph);
    } else {
      // Not a calculated node, so by definition no dependencies
      nodeList.push({ labTest: requestedLabTest, edges: [] });
    }
  });

  // Now walk the tree to generate the computation order
  let orderedLabList: labTestType[] = [];
  nodeList.forEach((node) => {
    const result = createDependencyOrderedList(node);

    // Iterate on result and only add tests not already in the orderedList
    result.forEach((lab) => {
      if (!_.contains(orderedLabList, lab)) orderedLabList.push(lab);
    });
  });

  return orderedLabList;
}
