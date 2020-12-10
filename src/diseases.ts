import _ from 'underscore';
import diseasesRoot from './builtins/diseases';

import { diseaseType, diseaseTreeNode } from './types/diseaseTypes';
import { testOverrideListType } from './types/labTestTypes';

export function findDiseaseByPath(path: string) {
  // Split the path
  const pathParts = path.split('.');

  const resultNode = pathParts.reduce<diseaseTreeNode | undefined>(
    (currentNode, pathPart) => currentNode?.children.find((node) => node.id === pathPart), // Find the next part of the path in the children of the current node
    diseasesRoot
  );

  return resultNode?.disease;
}

/**
 *
 * @param {string[]} diseaseProcesses A list of the disease IDs that should be applied to the current lab report
 *
 * @returns {testOverrideListType} An object containing keys for each test that is modified by the selected diseases. Each key contains an array of functions that modify the statistical parameters for that test.
 * @example returnValue = {
 *   'hgb': [
 *     {
 *       mean: (oldMean) => oldMean * 2,
 *       sd: (oldSD) => oldSD * 3
 *     }, {
 *       mean: (oldMean) => oldMean * 0.2,
 *       sd: (oldSD) => oldSD * 0.4
 *     }
 *   ]
 * }
 */
export function getDiseaseOverriddenTests (diseases: diseaseType[]) {
  return diseases.reduce<testOverrideListType>((out, disease) => {
    
    disease.testOverrides.forEach((testOverride) => {
      // Add an entry with the test id as the key to the override output, if it does not already exist.
      if (!_.has(out, testOverride.id))
        out[testOverride.id] = [];

      out[testOverride.id].push(testOverride);
    });

    return out;

  }, {});
};