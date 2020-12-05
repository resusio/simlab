import cardiacTests from './labTests/cardiac';
import chemistryTests from './labTests/chemistry';
import coagulationTests from './labTests/coagulation';
import hematologyTests from './labTests/hematology';
import hepatologyTests from './labTests/hepatology';
import renalTests from './labTests/renal';
import urinalysisTests from './labTests/urinalysis';

/**
 * An object containing keys for every available lab test. Each key contains an
 * object fully describing that lab test, including it's units, precision,
 * category, order of appearance with the category, low- and high-cutoff
 * values, names, and information on how to generate the result.
 */
export default [
  ...cardiacTests,
  ...chemistryTests,
  ...coagulationTests,
  ...hematologyTests,
  ...hepatologyTests,
  ...renalTests,
  ...urinalysisTests
];
