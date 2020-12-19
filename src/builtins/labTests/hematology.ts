import { labTestType, labTestGenerateMethod } from '../../types/labTestTypes';

const hematologyLabTests: labTestType[] = [
  {
    id: 'rbc',
    nomenclature: {
      long: 'Red Blood Cell Count',
      short: 'RBC',
      category: 'Hematology',
      orderInCategory: 20
    },
    display: {
      lowLimit: () => 4.4,
      highLimit: () => 5.7,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>12</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 5.05,
      sd: () => 0.331632653061224
    }
  },
  {
    id: 'hgb',
    nomenclature: {
      long: 'Hemoglobin',
      short: 'Hgb',
      category: 'Hematology',
      orderInCategory: 30
    },
    display: {
      lowLimit: () => 130,
      highLimit: () => 170,
      units: [
        {
          id: /imperial/,
          unitDisplay: 'g/dL',
          precision: 1,
          convert: (value) => (value as number) / 10.0
        },
        {
          id: /.*/,
          unitDisplay: 'g/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 150,
      sd: () => 10.2040816326531
    }
  },
  {
    id: 'hct',
    nomenclature: {
      long: 'Hematocrit',
      short: 'Hct',
      category: 'Hematology',
      orderInCategory: 40
    },
    display: {
      lowLimit: () => 0.38,
      highLimit: () => 0.5,
      units: [{ id: /.*/, unitDisplay: '', precision: 2, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      requires: ['hgb'],
      calculate: (testResults) => 0.003 * (testResults['hgb'] as number)
    }
  },
  {
    id: 'mcv',
    nomenclature: {
      long: 'Mean Corpuscular Volume',
      short: 'MCV',
      category: 'Hematology',
      orderInCategory: 50
    },
    display: {
      lowLimit: () => 80,
      highLimit: () => 100,
      units: [{ id: /.*/, unitDisplay: 'fL', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 90,
      sd: () => 5.10204081632653
    }
  },
  {
    id: 'mch',
    nomenclature: {
      long: 'Mean Corpuscular Hemoglobin',
      short: 'MCH',
      category: 'Hematology',
      orderInCategory: 55
    },
    display: {
      lowLimit: () => 17,
      highLimit: () => 34,
      units: [{ id: /.*/, unitDisplay: 'pg', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 25.5,
      sd: () => 4.33673469387755
    }
  },
  {
    id: 'plts',
    nomenclature: {
      long: 'Platelets',
      short: 'Plts',
      category: 'Hematology',
      orderInCategory: 70
    },
    display: {
      lowLimit: () => 130,
      highLimit: () => 400,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 265,
      sd: () => 68.8775510204082
    }
  },
  {
    id: 'rdw',
    nomenclature: {
      long: 'Red Blood Cell Distribution Width',
      short: 'RDW',
      category: 'Hematology',
      orderInCategory: 60
    },
    display: {
      lowLimit: () => 11.5,
      highLimit: () => 14.5,
      units: [{ id: /.*/, unitDisplay: '%', precision: 1, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 13,
      sd: () => 0.76530612244898
    }
  },
  {
    id: 'retics',
    nomenclature: {
      long: 'Reticulocyte Count',
      short: 'Retics',
      category: 'Hematology',
      orderInCategory: 65
    },
    display: {
      lowLimit: () => 20,
      highLimit: () => 84,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 52,
      sd: () => 16.3265306122449
    }
  },
  {
    id: 'esr',
    nomenclature: {
      long: 'Erythrocyte Sedimentation Rate',
      short: 'ESR',
      category: 'Hematology',
      orderInCategory: 140
    },
    display: {
      lowLimit: () => 1,
      highLimit: () => 6,
      units: [
        {
          id: /.*/,
          unitDisplay: 'mm/hr',
          precision: 0,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 3.5,
      sd: () => 1.27551020408163
    }
  },
  {
    id: 'crp',
    nomenclature: {
      long: 'C Reactive Protein',
      short: 'CRP',
      category: 'Hematology',
      orderInCategory: 150
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 8,
      units: [
        {
          id: /.*/,
          unitDisplay: 'mg/L',
          precision: 1,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 4,
      sd: () => 2.04081632653061
    }
  },
  {
    id: 'wbc',
    nomenclature: {
      long: 'White Blood Cell Count',
      short: 'WBC',
      category: 'Hematology',
      orderInCategory: 10
    },
    display: {
      lowLimit: () => 4,
      highLimit: () => 10,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 1,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      requires: ['neut', 'lymph', 'band', 'baso', 'eosin', 'mono'],
      calculate: (testResults) =>
        (testResults['neut'] as number) +
        (testResults['lymph'] as number) +
        (testResults['band'] as number) +
        (testResults['baso'] as number) +
        (testResults['eosin'] as number) +
        (testResults['mono'] as number)
    }
  },
  {
    id: 'neut',
    nomenclature: {
      long: 'Neutrophils',
      short: 'Neut',
      category: 'Hematology',
      orderInCategory: 80
    },
    display: {
      lowLimit: () => 2,
      highLimit: () => 7,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 4.5,
      sd: () => 1.27551020408163
    }
  },
  {
    id: 'band',
    nomenclature: {
      long: 'Bands',
      short: 'Band',
      category: 'Hematology',
      orderInCategory: 130
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 0.7,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 0.35,
      sd: () => 0.178571428571429
    }
  },
  {
    id: 'baso',
    nomenclature: {
      long: 'Basophils',
      short: 'Baso',
      category: 'Hematology',
      orderInCategory: 120
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 0.1,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 0.05,
      sd: () => 0.0255102040816327
    }
  },
  {
    id: 'eosin',
    nomenclature: {
      long: 'Eosinophils',
      short: 'Eosin',
      category: 'Hematology',
      orderInCategory: 110
    },
    display: {
      lowLimit: () => 0,
      highLimit: () => 0.45,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 0.225,
      sd: () => 0.114795918367347
    }
  },
  {
    id: 'lymph',
    nomenclature: {
      long: 'Lymphocytes',
      short: 'Lymph',
      category: 'Hematology',
      orderInCategory: 90
    },
    display: {
      lowLimit: () => 1,
      highLimit: () => 4,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 2.5,
      sd: () => 0.76530612244898
    }
  },
  {
    id: 'mono',
    nomenclature: {
      long: 'Monocytes',
      short: 'Mono',
      category: 'Hematology',
      orderInCategory: 100
    },
    display: {
      lowLimit: () => 0.1,
      highLimit: () => 1,
      units: [
        {
          id: /.*/,
          unitDisplay: '&times; 10<sup>9</sup>/L',
          precision: 2,
          convert: (value) => value
        }
      ]
    },
    generate: {
      method: labTestGenerateMethod.NORMAL,
      mean: () => 0.55,
      sd: () => 0.229591836734694
    }
  }
];

export default hematologyLabTests;
