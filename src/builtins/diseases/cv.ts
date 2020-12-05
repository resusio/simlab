import { labTestGenerateMethod } from '../../types/labTestTypes';
import { diseaseTreeNode } from '../../types/diseaseTypes';

/**
 * Contains information about the cardiovascular category of diseases, as well as
 * the information for each cardiovascular disease
 */
const cvDiseases: diseaseTreeNode[] = [
  {
    id: 'nstemi',
    children: [
      {
        id: 'nsvt',
        children: [],
        disease: {
          nomenclature: {
            long: 'Non-ST Elevation Myocardial Infarction with Electrical Instability',
            short: 'NSTEMI',
            description: 'ACS with elevated troponin and ck-mb and NSVT'
          },
          testOverrides: []
        }
      }
    ],
    disease: {
      nomenclature: {
        long: 'Non-ST Elevation Myocardial Infarction',
        short: 'NSTEMI',
        description: 'ACS with elevated troponin/ck-mb but normal ECG'
      },
      testOverrides: [
        {
          id: 'hstnt',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 60,
          sd: () => 100
        },
        {
          id: 'neut',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.5,
          sd: (mean, sd) => sd
        }
      ]
    }
  },

  {
    id: 'chf',
    children: [],
    disease: {
      nomenclature: {
        long: 'Exacerbated Congestive Heart Failure',
        short: 'CHF',
        description: 'Congestive heart failure with elevated BNP'
      },
      testOverrides: [
        {
          id: 'bnp',
          method: labTestGenerateMethod.NORMAL,
          mean: () => 8000,
          sd: () => 3000
        },
        {
          id: 'hstnt',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => (mean < 30 ? mean * 5 : mean),
          sd: (mean, sd) => sd
        }
      ]
    }
  }
];

export default cvDiseases;
