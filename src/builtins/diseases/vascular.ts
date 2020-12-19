import { labTestGenerateMethod } from '../../types/labTestTypes';
import { diseaseType } from '../../types/diseaseTypes';

/**
 * Contains information about the vascular category of diseases, as well as
 * the information for each vascular disease
 */
const vascDiseases: diseaseType[] = [
  {
    id: 'vasc.pe.submassive',
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
  },
  {
    id: 'vasc.pe.massive',
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
];

export default vascDiseases;
