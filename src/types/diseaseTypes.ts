import { labTestGenerateMethod, testResultType } from './labTestTypes';
import { testResultListType } from './labReportTypes';
import { patientInfoType } from './patientTypes';

export type diseaseTestOverrideType =
  | {
      id: string;
      method: labTestGenerateMethod.NORMAL;
      mean: (mean: number, sd: number, patient?: patientInfoType) => number;
      sd: (mean: number, sd: number, patient?: patientInfoType) => number;
    }
  | {
      id: string;
      method: labTestGenerateMethod.DERIVED;
      calculate: (testResults: testResultListType, patient?: patientInfoType) => testResultType;
    };

export interface diseaseType {
  id: string;
  nomenclature: {
    long: string;
    short: string;
    description: string;
  };
  testOverrides: diseaseTestOverrideType[];
}
