import { labTestType, labTestGenerateMethod } from '../../types/labTestTypes';
import { testResultFlag } from '../../types/labReportTypes';

const urinalysisLabTests: labTestType[] = [
  {
    id: 'udip-rbc',
    nomenclature: {
      long: 'Urinalysis RBCs',
      short: 'Dip RBCs',
      category: 'Urinalysis',
      orderInCategory: 10
    },
    display: {
      computeTestResultFlag: (testResult) =>
        testResult === 'Negative' ? testResultFlag.NORMAL : testResultFlag.ABNORMAL,
      units: [{ id: /.*/, unitDisplay: '', precision: 0, convert: (value) => value }]
    },
    generate: {
      method: labTestGenerateMethod.DERIVED,
      calculate: () => 'Negative'
    }
  }
];

export default urinalysisLabTests;
