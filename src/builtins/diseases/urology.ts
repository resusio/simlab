import { labTestGenerateMethod } from '../../types/labTestTypes';
import { diseaseType } from '../../types/diseaseTypes';
import random from 'random';

/**
 * Contains information about the urology category of diseases, as well as
 * the information for each trauma disease
 */
const urologyDiseases: diseaseType[] = [
  {
    id: 'urology.colic',
    nomenclature: {
      long: 'Renal Colic',
      short: 'Renal Colic',
      description: 'Renal colic with hematuria and mild renal impairement.'
    },
    testOverrides: [
      {
        id: 'cr',
        method: labTestGenerateMethod.NORMAL,
        mean: (mean) => mean * 1.25,
        sd: (mean, sd) => sd
      },
      {
        id: 'udip-rbc',
        method: labTestGenerateMethod.DERIVED,
        calculate: () => `${random.int(3, 4)}+`
      }
    ]
  }
];

export default urologyDiseases;
