import _ from 'underscore';

import orderSetList from './builtins/orderSets';

export function expandOrderSets(orderSets: string[], labTests: string[]) {
  function expandOrderSingleSetToLabTests(orderSetId: string): string[] {
    // Find the order set definition.
    const orderSet = orderSetList.find((setDef) => setDef.id === orderSetId);
    if (!orderSet) return []; // order set not found, don't do anything.

    const expandedTestList = orderSet.components.reduce<string[]>(
      (labTestList, orderSetComponent) => {
        if (orderSetList.find((setDef) => setDef.id === orderSetComponent)) {
          // This is a order set inside an order set, not a lab test
          return [...labTestList, ...expandOrderSingleSetToLabTests(orderSetComponent)];
        } else {
          // This is a lab test inside an order set
          return [...labTestList, orderSetComponent];
        }
      },
      []
    );

    return expandedTestList;
  }

  const finalLabTestList = orderSets.reduce<string[]>(
    (expandedTestList, orderSetId) => [
      ...expandedTestList,
      ...expandOrderSingleSetToLabTests(orderSetId)
    ], // Add the orders for the current orderset on to the accumulated order set
    labTests
  );

  return _.uniq(finalLabTestList)//.sort();
}
