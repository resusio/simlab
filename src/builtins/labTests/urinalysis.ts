import { labTestType, labTestGenerateMethod, testResultFlag } from '../../types/labTestTypes';

const urinalysisLabTests: labTestType[] = [
  {
    id: 'udip-rbc',
    nomenclature: {
      long: 'Dipstick',
      short: 'UDip',
      category: 'Urinalysis',
      orderInCategory: 10
    },
    display: {
      computeTestResultFlag: (testResult) => (testResult === "Negative" ? testResultFlag.NORMAL : testResultFlag.ABNORMAL),
      units: [{ id: '*', unitDisplay: '', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.STATIC,
      result: () => "Negative"
    }
  }
];

export default urinalysisLabTests;
