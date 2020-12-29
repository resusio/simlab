import { labTestType, labTestGenerateMethod, asNumber } from '../../types/labTestTypes';
import { gender } from '../../types/patientTypes';

const renalLabTests: labTestType[] = [
  {
    id: 'bun',
    nomenclature: {
      long: 'Urea',
      short: 'BUN',
      category: 'Renal Function',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 2.5,
      highLimit: () => 8,
      units: [
        {
          id: /.*/,
          unitDisplay: 'mmol/L',
          precision: 1,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      valueType: 'number',
      mean: () => 5.25,
      sd: () => 1.4030612244898
    }
  },
  {
    id: 'cr',
    nomenclature: {
      long: 'Creatinine',
      short: 'Cr',
      category: 'Renal Function',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 70,
      highLimit: () => 120,
      units: [
        {
          id: /.*/,
          unitDisplay: '&micro;mol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      valueType: 'number',
      mean: () => 95,
      sd: () => 12.7551020408163
    }
  },
  {
    id: 'gfr',
    nomenclature: {
      long: 'Gromerular Filtration Rate',
      short: 'GFR',
      category: 'Renal Function',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 60,
      highLimit: () => 130,
      units: [
        {
          id: /.*/,
          unitDisplay: 'mL/min/1.73 m<sup>2</sup>',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      valueType: 'number',
      requires: ['cr'],
      calculate: (testResults, patient) => {
        if (!patient) return Number.NaN;

        const sexAdjust = patient.gender && patient.gender === gender.Female ? 0.742 : 1.0;
        const ageAdjust = patient.age ? Math.pow(patient.age, -0.203) : Math.pow(40, -0.204);
        return 186 * Math.pow(asNumber(testResults['cr']) / 88.4, -1.154) * ageAdjust * sexAdjust;
      }
    }
  },
  {
    id: 'ck',
    nomenclature: {
      long: 'Creatinine Kinase',
      short: 'CK',
      category: 'Renal Function',
      orderInCategory: 40
    },
    display: {
      lowLimit: () => 20,
      highLimit: () => 215,
      units: [{ id: /.*/, unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      valueType: 'number',
      mean: () => 117.5,
      sd: () => 49.7448979591837
    }
  }
];

export default renalLabTests;
