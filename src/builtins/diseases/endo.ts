import { labTestGenerateMethod } from '../../types/labTestTypes';
import { diseaseTreeNode } from '../../types/diseaseTypes';

/**
 * Contains information about the endocrine category of diseases, as well as
 * the information for each endocrine disease
 */
const endoDiseases: diseaseTreeNode[] = [
  {
    id: 'dka',
    children: [],
    disease: {
      nomenclature: {
        long: 'Diabetic Ketoacidosis',
        short: 'DKA',
        description: 'Acidosis with high glucose and ketosis, and other metabolic disturbances'
      },
      testOverrides: [
        {
          id: 'neut',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.75,
          sd: (mean, sd) => sd * 1.25
        },
        {
          id: 'hgb',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.1,
          sd: (mean, sd) => sd
        },
        {
          id: 'plt',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.1,
          sd: (mean, sd) => sd
        },
        {
          id: 'gluc',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => 35,
          sd: (mean, sd) => sd
        },
        {
          id: 'na',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.05,
          sd: (mean, sd) => sd
        },
        {
          id: 'cl',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1,
          sd: (mean, sd) => sd
        },
        {
          id: 'k',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.2,
          sd: (mean, sd) => sd * 1.2
        },
        {
          id: 'hco3',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => 5,
          sd: (mean, sd) => 3
        },
        {
          id: 'cr',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.3,
          sd: (mean, sd) => sd
        },
        {
          id: 'bun',
          method: labTestGenerateMethod.NORMAL,
          mean: (mean) => mean * 1.2,
          sd: (mean, sd) => sd
        }
      ]
    }
  }
];

export default endoDiseases;
