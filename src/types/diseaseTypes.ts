import { labTestGenerateMethod } from './labTestTypes';
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
    };

export interface diseaseType {
  nomenclature: {
    long: string;
    short: string;
    description: string;
  };
  testOverrides: diseaseTestOverrideType[];
}

export interface diseaseTreeNode {
  id: string;
  children: diseaseTreeNode[];
  disease?: diseaseType;
}
