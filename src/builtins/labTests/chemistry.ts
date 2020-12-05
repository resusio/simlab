import { labTestType, labTestGenerateMethod, asNumber } from '../../types/labTestTypes';

const chemistryLabTests: labTestType[] = [
  {
    id: 'gluc',
    nomenclature: {
      long: 'Glucose',
      short: 'Gluc',
      category: 'Chemistry',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 3.8,
      highLimit: () => 11.1,
      units: [
        {
          id: '*',
          unitDisplay: 'mmol/L',
          precision: 1,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 7.45,
      sd: () => 1.86224489795918
    }
  },
  {
    id: 'na',
    nomenclature: {
      long: 'Sodium',
      short: 'Na',
      category: 'Chemistry',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 135,
      highLimit: () => 145,
      units: [
        {
          id: '*',
          unitDisplay: 'mmol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 140,
      sd: () => 2.55102040816327
    }
  },
  {
    id: 'k',
    nomenclature: {
      long: 'Potassium',
      short: 'K',
      category: 'Chemistry',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 3.5,
      highLimit: () => 5,
      units: [
        {
          id: '*',
          unitDisplay: 'mmol/L',
          precision: 1,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 4.25,
      sd: () => 0.38265306122449
    }
  },
  {
    id: 'cl',
    nomenclature: {
      long: 'Chloride',
      short: 'Cl',
      category: 'Chemistry',
      orderInCategory: 40
    },
    display: {
      lowLimit: () => 98,
      highLimit: () => 106,
      units: [
        {
          id: '*',
          unitDisplay: 'mmol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 102,
      sd: () => 2.04081632653061
    }
  },
  {
    id: 'hco3',
    nomenclature: {
      long: 'Bicarbonate',
      short: 'HCO3',
      category: 'Chemistry',
      orderInCategory: 50
    },
    display: {
      lowLimit: () => 24,
      highLimit: () => 30,
      units: [
        {
          id: '*',
          unitDisplay: 'mmol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 27,
      sd: () => 1.53061224489796
    }
  },
  {
    id: 'ag',
    nomenclature: {
      long: 'Anion Gap',
      short: 'AG',
      category: 'Chemistry',
      orderInCategory: 60
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 12,
      units: [
        {
          id: '*',
          unitDisplay: 'mEq/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      requires: ['na', 'cl', 'hco3'],
      calculate: (testResults) =>
        asNumber(testResults['na']) - asNumber(testResults['cl']) - asNumber(testResults['hco3'])
    }
  }
];

export default chemistryLabTests;
