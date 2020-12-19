import _ from 'underscore';

import * as util from 'util';

import builtinDiseases from './builtins/diseases';
import builtinLabTests from './builtins/labTests';
import builtinOrderSets from './builtins/orderSets';
import builtinCategories from './builtins/categories';

import {
  isComputedFlag,
  isDerivedGenerator,
  isNormalGenerator,
  isParameterFlag,
  labTestDisplayFlagParametersType,
  labTestType,
  testOverrideListType,
  testResultListType,
  testResultType
} from './types/labTestTypes';
import { orderLabTestsByDependency } from './dependencyGraph';
import { diseaseType } from './types/diseaseTypes';
import { gender, patientInfoType } from './types/patientTypes';
import { generateNormalLabTest, generateDerivedLabTest } from './stats';
import { orderSetType } from './types/orderSetTypes';
import { categoryType } from './types/categoryTypes';
import {
  categoryWithTests,
  fullTestResultType,
  labTestResultType,
  testResultFlag
} from './types/labReportTypes';

// TODO: allow overridding categories
interface labReportGeneratorConfigType {
  labTests?: labTestType[];
  orderSets?: orderSetType[];
  diseases?: diseaseType[];
  categories?: categoryType[];
}

class LabReportGenerator {
  // ==== Private fields ======================================================
  private labTests: labTestType[];
  private orderSets: orderSetType[];
  private diseaseSet: diseaseType[];
  private categorySet: categoryType[];

  private requestedLabTests: labTestType[] = [];
  private requestedOrderSets: orderSetType[] = [];
  private diseases: diseaseType[] = [];
  private patient: patientInfoType;

  private fullLabReportResults: testResultListType;
  private requestedLabTestResultIds: string[]; // Stores the ids of the lab tests that were actually requested by the user.

  // ==== Constructor =========================================================
  constructor(
    requestedTestIds: string[] = [],
    requestedOrderSetIds: string[] = [],
    patient: patientInfoType = { age: 45, weight: 70, height: 170, gender: gender.Female },
    diseaseIds: string[] = [],
    config?: labReportGeneratorConfigType
  ) {
    // Concatenate any additional lab tests, order sets, or diseases
    this.labTests = [...builtinLabTests, ...(config?.labTests || [])];
    this.orderSets = [...builtinOrderSets, ...(config?.orderSets || [])];
    this.diseaseSet = [...builtinDiseases, ...(config?.diseases || [])];
    this.categorySet = [...builtinCategories, ...(config?.categories || [])];

    // Save the lab tests and order sets for this lab report
    this.setRequestedLabTests(requestedTestIds);
    this.setRequestedOrderSets(requestedOrderSetIds);

    // Save the diseases for this patient
    this.setDiseases(diseaseIds);

    // Save the patient info
    this.patient = patient;

    // Initialize empty lab report
    this.fullLabReportResults = {};
    this.requestedLabTestResultIds = [];

    // For the sake of efficiency, we need to generate inverse links for derived tests
    // e.g. any other test can be 'needed by' a derived test, and by adding a neededBy
    // item to the generator information, we don't need to search the entire list of
    // lab tests every time we're building dependency graphs.
    // These inverse links are generated automatically
    this.labTests.forEach((labTestConfig) => {
      if (isDerivedGenerator(labTestConfig) && labTestConfig.generate.requires) {
        // Loop through each required test, find it, and add a neededBy link back to this test.
        labTestConfig.generate.requires.forEach((requiredTestId) => {
          // Find the required test
          const requiredTest = this.labTests.find(
            (testToCheck) => testToCheck.id === requiredTestId
          );
          if (requiredTest) {
            // Found a test that is required by labTestConfig. Add the neededBy link
            if (!requiredTest.generate.neededBy) requiredTest.generate.neededBy = []; // Initiate if not present

            // Push the current labTestConfig id to the neededBy list for the located test
            requiredTest.generate.neededBy.push(labTestConfig.id);
          }
        });
      }
    });
  }

  // ==== Public methods ======================================================
  public generateLabReport() {
    // Expand the list of requested lab tests and order sets to just lab tests
    // This is the list of lab tests actually provided to the user.
    const fullTestList = this.expandOrderSets(this.requestedOrderSets, this.requestedLabTests);
    this.requestedLabTestResultIds = fullTestList.map((test) => test.id);

    // Create an ordered list of labs such that derived labs will be computed after the labs that
    // their values depend on (create and solve a dependency graph).
    // This is the list of lab tests that must be computed. Some of these may not make it back to the user.
    const orderedTestList = orderLabTestsByDependency(fullTestList, this.labTests);

    // Using the specified diseases, calculate a list of lab tests that should be overridden
    const overriddenTests = this.getDiseaseOverriddenTests(this.diseases);

    // Finally, iterate over every requested lab and required lab, and calculate a result.
    this.fullLabReportResults = orderedTestList.reduce<testResultListType>(
      (labReport, currLabTest) => {
        labReport[currLabTest.id] = this.computeSingleLab(
          currLabTest,
          labReport,
          overriddenTests,
          this.patient
        );

        return labReport;
      },
      {}
    );
  }

  public fetchLabReport({ labIds, units = 'metric' }: { labIds?: string[]; units?: string } = {}) {
    // If some labIds are provided, select only those that appear both in the provided labIds array,
    // and the requestedLabTestResultIds array
    const labTestIdsComputed = labIds
      ? _.intersection(labIds, this.requestedLabTestResultIds)
      : this.requestedLabTestResultIds;

    // Select only the desired lab results
    const filteredLabResults = _.pick(this.fullLabReportResults, labTestIdsComputed);

    const categories: {
      name: string;
      sortOrder: number;
      tests: { id: string; sortOrder: number }[];
    }[] = [];

    const labTestWithMetadata = _.keys(filteredLabResults).reduce<labTestResultType>(
      (result, labId) => {
        // Find the lab metadata
        const labTestConfig = this.labTests.find((testLab) => testLab.id === labId);
        if (!labTestConfig) return result; // If lab configuration not found, ignore the result

        // Select which set of units to use
        const selectedUnit = labTestConfig.display.units.find((unitToTest) =>
          unitToTest.id.test(units)
        );
        if (!selectedUnit) return result; // If no unit, ignore this result (should never happen as all tests should have /.*/ as a matching pattern

        // Compute flag using either numeric limits or compute function
        let resultFlag = testResultFlag.NORMAL;
        if (isComputedFlag(labTestConfig.display))
          resultFlag = labTestConfig.display.computeTestResultFlag(
            filteredLabResults[labId],
            this.patient
          );
        else if (isParameterFlag(labTestConfig.display))
          resultFlag = this.computeResultFlagFromParameters(
            filteredLabResults[labId] as number,
            labTestConfig.display
          );

        // Finally, add test id to the category list ${categories}
        // 1. Find the category in the category list. If it doesn't exist, categorize as category name "" and put it at the end of the list.
        const categoryInfo = this.categorySet.find(
          (categoryToTest) =>
            categoryToTest.categoryName.toLowerCase() ===
            labTestConfig.nomenclature.category.toLowerCase()
        ) || { categoryName: '', sortIndex: Number.MAX_VALUE };

        // 2. See if there is already an entry for this category in the local category sort-and-testId list
        let categoryEntry = categories.find(
          (categoryToTest) => categoryToTest.name === labTestConfig.nomenclature.category
        );

        // 3. Category entry not found, add a new blank one.
        if (!categoryEntry) {
          categoryEntry = {
            name: categoryInfo.categoryName,
            sortOrder: categoryInfo.sortIndex,
            tests: []
          };
          categories.push(categoryEntry);
        }

        // 4. Add the current test to the category sort-and-testId list.
        categoryEntry.tests.push({
          id: labId,
          sortOrder: labTestConfig.nomenclature.orderInCategory
        });

        // Create the new object, add it into the accumulator for the reduce function, and return the object for the next iteration.
        result[labId] = {
          value: selectedUnit.convert(filteredLabResults[labId]),
          nomenclature: {
            short: labTestConfig.nomenclature.short,
            long: labTestConfig.nomenclature.long
          },
          display: {
            unitDisplay: selectedUnit.unitDisplay,
            precision: selectedUnit.precision,
            flag: resultFlag
          }
        };

        return result;
      },
      {} // Start with an empty array
    );

    // Now sort the list of tests in each category and remove the 'sortOrder' flag.
    const categoriesFinal: categoryWithTests[] = categories
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((category) => ({
        name: category.name,
        testIds: category.tests.sort((a, b) => a.sortOrder - b.sortOrder).map((test) => test.id)
      }));

    return <fullTestResultType>{
      tests: labTestWithMetadata,
      categories: categoriesFinal
    };
  }

  public updateSingleTest(testId: string, newValue?: testResultType): string[] {
    const labTestConfig = this.labTests.find((labTestToTest) => labTestToTest.id === testId);
    if (!labTestConfig) return [];

    // If a newValue is provided, set it, else generate
    if (newValue) {
      this.fullLabReportResults[testId] = newValue;
    } else {
      const newResult = this.computeSingleLab(
        labTestConfig,
        this.fullLabReportResults,
        this.getDiseaseOverriddenTests(this.diseases),
        this.patient
      );
      this.fullLabReportResults[testId] = newResult;
    }

    if (labTestConfig.generate.neededBy) {
      const neededByResults = _.flatten(
        labTestConfig.generate.neededBy.map((testId) => [...this.updateSingleTest(testId)])
      );
      return _.uniq([testId, ...neededByResults]);
    } else {
      return [testId];
    }
  }

  public updateAndFetchSingleTest(
    testId: string,
    newValue?: testResultType,
    units: string = 'metric'
  ): fullTestResultType {
    const updatedTests = this.updateSingleTest(testId, newValue);

    return this.fetchLabReport({
      labIds: updatedTests,
      units: units
    });
  }

  public addDiseases(diseaseIds: string | string[]) {
    if (!Array.isArray(diseaseIds)) diseaseIds = [diseaseIds];

    diseaseIds.forEach((diseaseId) => {
      const diseaseConfig = this.diseaseSet.find(
        (checkDisease) => checkDisease.id.toLowerCase() === diseaseId.toLowerCase()
      );

      // Ensure it does not already exist in our list of diseases
      if (diseaseConfig && this.diseases.indexOf(diseaseConfig) === -1)
        this.diseases.push(diseaseConfig);
    });
  }

  public removeDiseases(diseaseIds: string | string[]) {
    if (!Array.isArray(diseaseIds)) diseaseIds = [diseaseIds];

    this.diseases = this.diseases.filter(
      (checkDisease) => diseaseIds.indexOf(checkDisease.id) === -1
    );
  }

  public clearDiseases() {
    this.diseases = [];
  }

  public setDiseases(diseaseIds: string | string[]) {
    this.clearDiseases();
    this.addDiseases(diseaseIds);
  }

  public addRequestedLabTests(labTestIds: string | string[]) {
    if (!Array.isArray(labTestIds)) labTestIds = [labTestIds];

    labTestIds.forEach((labTestId) => {
      const labTestConfig = this.labTests.find(
        (checkLabTest) => checkLabTest.id.toLowerCase() === labTestId.toLowerCase()
      );

      // Ensure it does not already exist in our list of lab tests
      if (labTestConfig && this.requestedLabTests.indexOf(labTestConfig) === -1)
        this.requestedLabTests.push(labTestConfig);
    });
  }

  public removeRequestedLabTests(labTestIds: string | string[]) {
    if (!Array.isArray(labTestIds)) labTestIds = [labTestIds];

    this.requestedLabTests = this.requestedLabTests.filter(
      (checkLabTest) => labTestIds.indexOf(checkLabTest.id) === -1
    );
  }

  public clearRequestedLabTests() {
    this.requestedLabTests = [];
  }

  public setRequestedLabTests(labTestIds: string | string[]) {
    this.clearRequestedLabTests();
    this.addRequestedLabTests(labTestIds);
  }

  public addRequestedOrderSets(orderSetIds: string | string[]) {
    if (!Array.isArray(orderSetIds)) orderSetIds = [orderSetIds];

    orderSetIds.forEach((orderSetId) => {
      const orderSetConfig = this.orderSets.find(
        (checkOrderSet) => checkOrderSet.id.toLowerCase() === orderSetId.toLowerCase()
      );

      // Ensure it does not already exist in our list of lab tests
      if (orderSetConfig && this.requestedOrderSets.indexOf(orderSetConfig) === -1)
        this.requestedOrderSets.push(orderSetConfig);
    });
  }

  public removeRequestedOrderSets(orderSetIds: string | string[]) {
    if (!Array.isArray(orderSetIds)) orderSetIds = [orderSetIds];

    this.requestedOrderSets = this.requestedOrderSets.filter(
      (checkOrderSet) => orderSetIds.indexOf(checkOrderSet.id) === -1
    );
  }

  public clearRequestedOrderSets() {
    this.requestedOrderSets = [];
  }

  public setRequestedOrderSets(orderSetIds: string | string[]) {
    this.clearRequestedOrderSets();
    this.addRequestedOrderSets(orderSetIds);
  }

  // ==== Private methods =====================================================
  /**
   * Computes the lab result flag (e.g. high, low, critically high, critically
   * low, or normal) from the provided test result and parameter methods
   * @param value Result of the lab test that the flag is being computed for
   * @param parameters Methods to calculate low/high limits for this particular lab test
   * @returns Enum value indicating the test flag
   */
  computeResultFlagFromParameters(
    value: testResultType & number,
    parameters: labTestDisplayFlagParametersType
  ): testResultFlag {
    if (parameters.criticalLowLimit && value <= parameters.criticalLowLimit(this.patient))
      return testResultFlag.CRITICAL_LOW;
    else if (value <= parameters.lowLimit(this.patient)) return testResultFlag.LOW;
    else if (parameters.criticalHighLimit && value >= parameters.criticalHighLimit(this.patient))
      return testResultFlag.CRITICAL_HIGH;
    else if (value >= parameters.highLimit(this.patient)) return testResultFlag.HIGH;
    else return testResultFlag.NORMAL;
  }

  /**
   * Computes the result for a single lab given all the necessary metdata.
   * @param labTest Metadata for the test to be computed
   * @param labReport All lab tests computed so far
   * @param overriddenTests Tests that the chosen disease states are overriding
   * @param patient Information about the patient that the lab tests are being computed for
   */
  private computeSingleLab(
    labTest: labTestType,
    labReport: testResultListType,
    overriddenTests: testOverrideListType,
    patient: patientInfoType
  ) {
    if (isNormalGenerator(labTest)) {
      return generateNormalLabTest(labTest, labReport, overriddenTests, patient);
    } else if (isDerivedGenerator(labTest)) {
      return generateDerivedLabTest(labTest, labReport, overriddenTests, patient);
    }

    return 0;
  }

  /**
   * Takes a list of order sets and a list of lab tests, and expands the order sets
   * into individual tests, returning the union of the two without any duplicate lab
   * tests.
   * @param orderSets Array of order sets to be expanded into individual lab tests
   * @param labTests Array of lab tests that the order sets will be added to
   * @returns Array of lab tests comprising the union of the lab tests that were
   * passed in, and the lab tests making up the provided order sets.
   */
  private expandOrderSets(orderSets: orderSetType[], labTests: labTestType[]): labTestType[] {
    let finalLabTestList: labTestType[] = [...labTests];

    while (orderSets.length > 0) {
      // Take the first order set off the list
      const orderSet = orderSets.pop();

      if (!orderSet) break; // If no order set on the array, leave the array.

      // Loop through each component of the order set.
      const orderSetTests = orderSet.components.reduce<labTestType[]>(
        (labTestList, orderSetComponentId) => {
          const nestedOrderSet = this.orderSets.find(
            (checkOrderSet) => checkOrderSet.id === orderSetComponentId
          );
          if (nestedOrderSet) {
            orderSets.push(nestedOrderSet); // This order set component is another order set, not a lab test. Add it to the array of order sets to expand and we'll get to it later.
          } else {
            const labTest = this.labTests.find(
              (checkLabTest) => checkLabTest.id === orderSetComponentId
            );
            if (labTest)
              // Ensure id references a valid lab test, and push it if so.
              labTestList.push(labTest);
          }
          return labTestList;
        },
        []
      );

      finalLabTestList.push(...orderSetTests);
    }

    return _.uniq(finalLabTestList);
  }

  /**
   * Takes a list of diseases and transforms it into an object containing the overrides that
   * need to be applied to each lab test in the lab report.
   * @param diseases Array of diseases to generate the overload list for
   * @returns An object containing keys for every overridden test. Each key holds an array
   * of override parameters for that test
   */
  private getDiseaseOverriddenTests(diseases: diseaseType[]) {
    return diseases.reduce<testOverrideListType>((out, disease) => {
      disease.testOverrides.forEach((testOverride) => {
        // Add an entry with the test id as the key to the override output, if it does not already exist.
        if (!_.has(out, testOverride.id)) out[testOverride.id] = [];

        out[testOverride.id].push(testOverride);
      });

      return out;
    }, {});
  }
}
