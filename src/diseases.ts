import diseasesRoot from './builtins/diseases';

import { diseaseType, diseaseTreeNode } from './types/diseaseTypes';

export function findDiseaseByPath(path: string): diseaseType | undefined {
  // Split the path
  const pathParts = path.split('.');

  const resultNode = pathParts.reduce<diseaseTreeNode | undefined>(
    (currentNode, pathPart) => currentNode?.children.find((node) => node.id === pathPart), // Find the next part of the path in the children of the current node
    diseasesRoot
  );

  return resultNode?.disease;
}
