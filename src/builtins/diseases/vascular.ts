import { labTestGenerateMethod } from '../../types/labTestTypes';
import { diseaseTreeNode } from '../../types/diseaseTypes';

/**
 * Contains information about the vascular category of diseases, as well as
 * the information for each vascular disease
 */
const vascDiseases: diseaseTreeNode[] = [
  {
    id: 'pe',
    children: [
      {
        id: 'submassive',
        children: [],
        disease: {
          nomenclature: {
            long: 'Submassive Pulmonary Embolism',
            short: 'Submassive PE',
            description: 'A pulmonary embolism with mild troponin elevation due to strain'
          },
          testOverrides: [
            {
              id: 'dimer',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 15,
              sd: (mean, sd) => sd * 5
            },
            {
              id: 'hstnt',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 4,
              sd: (mean, sd) => sd
            },
            {
              id: 'crp',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 10,
              sd: (mean, sd) => sd * 4
            }
          ]
        }
      },
      {
        id: 'massive',
        children: [],
        disease: {
          nomenclature: {
            long: 'Massive Pulmonary Embolism',
            short: 'Massive PE',
            description:
              'A pulmonary embolism with marked troponin elevation due to strain and RV failure/infarct'
          },
          testOverrides: [
            {
              id: 'dimer',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 25,
              sd: (mean, sd) => sd * 2
            },
            {
              id: 'hstnt',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 25,
              sd: (mean, sd) => sd
            },
            {
              id: 'crp',
              method: labTestGenerateMethod.NORMAL,
              mean: (mean) => mean * 10,
              sd: (mean, sd) => sd * 4
            }
          ]
        }
      }
    ]
  }
];

export default vascDiseases;

/*
const traumaDiseases: diseaseTreeNode[] = [
  {
    id: 'rhabdo',
    children: [],
    disease: {
      nomenclature: {
        long: 'Rhabdomyolysis',
        short: 'Rhabdo',
        description: 'Rhabdomyolysis with elevated CK and renal failure'
      },
      testOverrides: [
        {
          id: 'ck',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => 20000,
          sd: () => 4000
        },
        {
          id: 'cr',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 3,
          sd: (mean, sd) => sd
        },
        {
          id: 'bun',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 3,
          sd: (mean, sd) => sd
        }
      ]
    }
  }
];

export default traumaDiseases;
*/
