import { labTestType, labTestGenerateMethod } from '../../types/labTestTypes';

const coagulationLabTests: labTestType[] = [
  {
    id: 'inr',
    nomenclature: {
      long: 'International Normalized Ratio',
      short: 'INR',
      category: 'Coagulation',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 0.9,
      highLimit: () => 1.2,
      units: [{ id: /.*/, unitDisplay: '', precision: 1, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL, // TODO: Should be caculated from PTT
      mean: () => 1.05,
      sd: () => 0.0765306122448979
    }
  },
  {
    id: 'pt',
    nomenclature: {
      long: 'Prothrombin Time',
      short: 'PT',
      category: 'Coagulation',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 10,
      highLimit: () => 13,
      units: [{ id: /.*/, unitDisplay: 'sec', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 11.5,
      sd: () => 0.76530612244898
    }
  },
  {
    id: 'ptt',
    nomenclature: {
      long: 'Partial Thromboplastin Time',
      short: 'PTT',
      category: 'Coagulation',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 28,
      highLimit: () => 38,
      units: [{ id: /.*/, unitDisplay: 'sec', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 33,
      sd: () => 2.55102040816327
    }
  },
  {
    id: 'dimer',
    nomenclature: {
      long: 'D-Dimer',
      short: 'D-Dimer',
      category: 'Coagulation',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 0.5,
      units: [{ id: /.*/, unitDisplay: 'mg/L', precision: 2, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 0.2,
      sd: () => 0.2
    }
  }
];

export default coagulationLabTests;
