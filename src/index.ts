import _, { result } from 'underscore';

import diseases from './builtins/diseases';
import labTests from './builtins/labTests';
import orderSets from './builtins/orderSets';
import categories from './builtins/categories';

import { getDiseaseOverriddenTests, findDiseaseByPath } from './diseases';

import {
  labTestGenerateMethod,
  labTestType,
  testOverrideListType,
  testResultListType,
  testResultType
} from './types/labTestTypes';
import { expandOrderSets } from './orderSets';
import { createOrderedLabList } from './dependencyGraph';
import { diseaseType } from './types/diseaseTypes';
import { gender, patientInfoType } from './types/patientTypes';
import { generateNormalLab } from './stats';

interface labReportConfigType {
  labTestIds: string[];
  orderSetIds: string[];
}

export function updateLabReport(
  { labTestIds, orderSetIds }: labReportConfigType,
  currentLabReport: testResultListType,
  patient: patientInfoType,
  diseaseIds?: string[]
) {
  // Expand the list of requested lab tests and order sets to just lab tests
  const fullTestList = expandOrderSets(orderSetIds, labTestIds);

  // Generate dependency list:
  //   Any derived lab values must be computed AFTER the labs they depend on are generated. To do this we
  //   generate a list of ancestor lab tests and then generate the list in that order.
  const orderedTestList = createOrderedLabList(fullTestList);

  // First expand the list of disease ids/paths into the config object, ignoring paths that don't exist.
  // We then generate a list of tests that are overridden, and what the overrides are.
  const diseaseConfigs = diseaseIds
    ? diseaseIds.reduce<diseaseType[]>((diseaseList, diseaseId) => {
        const diseaseConfig = findDiseaseByPath(diseaseId);
        if (diseaseConfig) diseaseList.push(diseaseConfig);

        return diseaseList;
      }, [])
    : [];
  const overriddenTests = getDiseaseOverriddenTests(diseaseConfigs);

  // Now loop through the ordered test list and generate a result for each test.
  const testResultList = orderedTestList.reduce<testResultListType>((resultList, currTestId, i) => {
    // Locate the test configuration
    const currTestConfig = labTests.find((labTest) => labTest.id === currTestId);
    if (!currTestConfig) return resultList; // If no test config is found, abort this iteration and return the result object as is.

    switch (currTestConfig.generate.method) {
      case labTestGenerateMethod.NORMAL:
        resultList[currTestConfig.id] = generateNormalLabTest(currTestConfig, resultList, overriddenTests, patient);
        break;

      case labTestGenerateMethod.DERIVED:
        resultList[currTestConfig.id] = generateDerivedLabTest(currTestConfig, resultList, overriddenTests, patient);
        break;

      case labTestGenerateMethod.STATIC:
        resultList[currTestConfig.id] = generateStaticLabTest(currTestConfig, resultList, overriddenTests, patient);
    }

    //resultList[currTestId] = currTestConfig.nomenclature.long;

    return resultList;
  }, currentLabReport); // Pass in any current lab values so that they can be used by derived functions.

  console.log(testResultList);
}

function generateNormalLabTest(
  labTest: labTestType,
  currentLabReport: testResultListType,
  overriddenTests: testOverrideListType,
  patient: patientInfoType
) {
  let result: testResultType = 0;
  if (labTest.generate.method === labTestGenerateMethod.NORMAL) {
    let mean = labTest.generate.mean(patient, currentLabReport);
    let sd = labTest.generate.sd(patient, currentLabReport);

    if (_.has(overriddenTests, labTest.id)) {
      mean = overriddenTests[labTest.id].reduce<number>((lastMean, currOverride) => {
        if (currOverride.method === labTestGenerateMethod.NORMAL)
          return currOverride.mean(lastMean, sd, patient);
        else return lastMean;
      }, mean);
      
      sd = overriddenTests[labTest.id].reduce<number>((lastSd, currOverride) => {
        if (currOverride.method === labTestGenerateMethod.NORMAL)
          return currOverride.sd(mean, lastSd, patient);
        else return lastSd;
      }, sd);
    }

    result = generateNormalLab(mean, sd, labTest.generate.allowNegative || false);
  }

  return result;
}

function generateDerivedLabTest(
  labTest: labTestType,
  currentLabReport: testResultListType,
  overriddenTests: testOverrideListType,
  patient: patientInfoType
) {
  let result: testResultType = 0;
  if (labTest.generate.method === labTestGenerateMethod.DERIVED) {
    // Ensure that all tests with listed defaults either exist, or else include them.
    const neededDefaults = labTest.generate.defaults?.reduce<testResultListType>((defaultList, currDefault) => {
      if (!_.has(currentLabReport, currDefault.id))
        defaultList[currDefault.id] = currDefault.value;

      return defaultList;
    }, {});

    // TODO: should use overrides here.

    result = labTest.generate.calculate({ ...currentLabReport, ...neededDefaults }, patient);
  }

  return result;
}

function generateStaticLabTest(
  labTest: labTestType,
  currentLabReport: testResultListType,
  overriddenTests: testOverrideListType,
  patient: patientInfoType
) {
  let result: testResultType = 0;
  if (labTest.generate.method === labTestGenerateMethod.STATIC) {
    if (_.has(overriddenTests, labTest.id)) {
      // If an override exists on a static test: loop through each, update the lab test report, and then do the next.
      // This way they can accumulate on top of previous overrides.
      overriddenTests[labTest.id].forEach((currOverride) => {
        if (currOverride.method === labTestGenerateMethod.STATIC) {
          result = currOverride.result(currentLabReport, patient);
          currentLabReport[labTest.id] = result;
        }
      });
    } else 
      result = labTest.generate.result(currentLabReport, patient);
  }

  return result;
}

const patient: patientInfoType = { age: 40, weight: 70, height: 180, gender: gender.Male };

updateLabReport({ labTestIds: ['na', 'k', 'hstnt', 'bnp', 'udip-rbc'], orderSetIds: ['cbc'] }, { hgb: 12.3 }, patient, [
  'cv.nstemi',
  'cv.chf',
  'urology.renalcolic'
]);

export default {
  diseases,
  labTests,
  orderSets,
  categories
};
