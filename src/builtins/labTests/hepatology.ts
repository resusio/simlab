import { labTestType, labTestGenerateMethod, asNumber } from '../../types/labTestTypes';

const hepatologyLabTests: labTestType[] = [
  {
    id: 'ast',
    nomenclature: {
      long: 'Aspartate Aminotransferase',
      short: 'AST',
      category: 'Hepatology',
      orderInCategory: 40
    },
    display: {
      lowLimit: () => 18,
      highLimit: () => 40,
      units: [{ id: '*', unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 29,
      sd: () => 5.61224489795918
    }
  },
  {
    id: 'alt',
    nomenclature: {
      long: 'Alanine Aminotransferase',
      short: 'ALT',
      category: 'Hepatology',
      orderInCategory: 50
    },
    display: {
      lowLimit: () => 17,
      highLimit: () => 63,
      units: [{ id: '*', unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 40,
      sd: () => 11.734693877551
    }
  },
  {
    id: 'ggt',
    nomenclature: {
      long: 'Gamma-glutamyl Transferase',
      short: 'GGT',
      category: 'Hepatology',
      orderInCategory: 60
    },
    display: {
      lowLimit: () => 10,
      highLimit: () => 48,
      units: [{ id: '*', unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 29,
      sd: () => 9.69387755102041
    }
  },
  {
    id: 'alp',
    nomenclature: {
      long: 'Alkaline Phosphatase',
      short: 'ALP',
      category: 'Hepatology',
      orderInCategory: 70
    },
    display: {
      lowLimit: () => 38,
      highLimit: () => 126,
      units: [{ id: '*', unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 82,
      sd: () => 22.4489795918367
    }
  },
  {
    id: 'dbili',
    nomenclature: {
      long: 'Bilirubin Direct',
      short: 'Dbili',
      category: 'Hepatology',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 4,
      units: [
        {
          id: '*',
          unitDisplay: '&micro;mol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 2,
      sd: () => 1.02040816326531
    }
  },
  {
    id: 'ibili',
    nomenclature: {
      long: 'Bilirubin Indirect',
      short: 'Ibili',
      category: 'Hepatology',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 19,
      units: [
        {
          id: '*',
          unitDisplay: '&micro;mol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 9.5,
      sd: () => 4.8469387755102
    }
  },
  {
    id: 'tbili',
    nomenclature: {
      long: 'Bilirubin Total',
      short: 'Tbili',
      category: 'Hepatology',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 8,
      highLimit: () => 22,
      units: [
        {
          id: '*',
          unitDisplay: '&micro;mol/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      requires: ['dbili'],
      /*defaults: {
        ibili: 5
      },*/
      calculate: (testResults) => asNumber(testResults['dbili']) + asNumber(testResults['ibili'])
    }
  },
  {
    id: 'lip',
    nomenclature: {
      long: 'Lipase',
      short: 'Lip',
      category: 'Hepatology',
      orderInCategory: 80
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 160,
      units: [{ id: '*', unitDisplay: 'U/L', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 80,
      sd: () => 40.8163265306122
    }
  }
];

export default hepatologyLabTests;
