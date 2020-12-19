import random from 'random';
import _ from 'underscore';
import {
  labTestGenerateMethod,
  labTestGenerateType,
  labTestType,
  testOverrideListType,
  testResultListType,
  testResultType
} from './types/labTestTypes';
import { patientInfoType } from './types/patientTypes';

/**
 * Generates a result that is normally distributed, given the mean and
 * standard deviations describing the test. It will only return a negative
 * result if allowNegative is true.
 * @param mean The mean of the normal distribution
 * @param sd The standard deviation of the normal distribution
 * @param allowNegative If true, the value is allowed to be negative. N.B. this does technically make the distribution non-normal if false
 *
 * @returns The resulting normally-distributed random value
 */
export function normal(mean: number, sd: number, allowNegative: boolean): number {
  sd = Math.abs(sd); // No negative standard deviation, by definition not possible (sqrt of variance)

  // Sanity check: if mean is negative and not within 2.5 SD of the mean, then this could loop forever
  if (!allowNegative && mean < 0 && mean + (sd * 2.5) < 0) throw new RangeError("Negative means must be within 2 standard deviations of 0 if negative results are not allowed.");

  let result: number;
  do {
    result = random.normal(mean, Math.abs(sd))();
  } while (result < 0 && !allowNegative);

  return result;
}

export function generateNormalLabTest(
  labTest: labTestType & {
    generate: Extract<labTestGenerateType, { method: labTestGenerateMethod.NORMAL }>;
  },
  currentLabReport: testResultListType,
  overriddenTests: testOverrideListType,
  patient: patientInfoType
) {
  let result: testResultType = 0;

  let mean = labTest.generate.mean(patient, currentLabReport);
  let sd = labTest.generate.sd(patient, currentLabReport);

  if (_.has(overriddenTests, labTest.id)) { // Lab test is overridden, compute the new mean/sd values.
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

  result = normal(mean, sd, labTest.generate.allowNegative || false);

  return result;
}

export function generateDerivedLabTest(
  labTest: labTestType & {
    generate: Extract<labTestGenerateType, { method: labTestGenerateMethod.DERIVED }>;
  },
  currentLabReport: testResultListType,
  overriddenTests: testOverrideListType,
  patient: patientInfoType
) {
  let result: testResultType = labTest.generate.calculate(currentLabReport, patient);

  if (_.has(overriddenTests, labTest.id)) {
    // If an override exists on a static test: loop through each, update the lab test report, and then do the next.
    // This way they can accumulate on top of previous overrides.

    // Start by cloning the lab report and setting this lab to the initial (un-overridden) value.
    let tempTotalLabReport = { ...currentLabReport };
    tempTotalLabReport[labTest.id] = result;

    overriddenTests[labTest.id].forEach((currOverride) => {
      if (currOverride.method === labTestGenerateMethod.DERIVED) {
        result = currOverride.calculate(tempTotalLabReport, patient);
        tempTotalLabReport[labTest.id] = result;
      }
    });
  }

  return result;
}