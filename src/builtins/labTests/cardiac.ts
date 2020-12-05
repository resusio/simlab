import { labTestType, labTestGenerateMethod } from '../../types/labTestTypes';

const cardiacLabTests: labTestType[] = [
  {
    id: 'hstnt',
    nomenclature: {
      long: 'High Sensitivity Troponin T',
      short: 'hs-TnT',
      category: 'Cardiac',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 14,
      units: [{ id: '*', unitDisplay: 'ng/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 7,
      sd: () => 3.57142857142857
    }
  },
  {
    id: 'bnp',
    nomenclature: {
      long: 'NT-ProBNP',
      short: 'BNP',
      category: 'Cardiac',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 125,
      units: [{ id: '*', unitDisplay: 'pg/mL', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 62.5,
      sd: () => 31.8877551020408
    }
  }
];

export default cardiacLabTests;
