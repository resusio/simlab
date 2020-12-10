import random from "random";
import { testResultType } from "./types/labTestTypes";

/**
 * Generates a lab result that is normally distributed, given the mean and
 * standard deviations describing the test. It will only return a negative
 * result if allowNegative is true.
 * @param {number} mean The mean of the normal distribution
 * @param {number} sd The standard deviation of the normal distribution
 * @param {boolean} allowNegative If true, the lab value is allowed to be negative. N.B. this does technically make the distribution non-normal if false
 *
 * @returns {number} The resultant random lab value
 */
export function generateNormalLab (mean: number, sd: number, allowNegative: boolean): number {
  let result: number;
  do {
    result = random.normal(mean, sd)();
  } while (result < 0 && !allowNegative);

  return result;
};