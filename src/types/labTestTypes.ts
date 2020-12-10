import { diseaseTestOverrideType } from './diseaseTypes';
import { patientInfoType } from './patientTypes';

export const enum testResultFlag {
  LOW,
  HIGH,
  CRITICAL_LOW,
  CRITICAL_HIGH,
  ABNORMAL,
  NORMAL
}

export type testResultType = number | string;

export interface testResultListType {
  [testId: string]: testResultType;
}

export interface testOverrideListType {
  [testId: string]: diseaseTestOverrideType[];
}

export interface labTestNomenclatureType {
  long: string;
  short: string;
  category: string;
  orderInCategory: number;
}

export interface labTestUnitType {
  id: string;
  unitDisplay: string;
  precision: number;
  convert: (value: testResultType) => testResultType;
}

export type labTestDisplayType =
  | {
      lowLimit: (patient?: patientInfoType) => number;
      highLimit: (patient?: patientInfoType) => number;
      criticalLowLimit?: (patient?: patientInfoType) => number;
      criticalHighLimit?: (patient?: patientInfoType) => number;
      units: labTestUnitType[];
    }
  | {
      computeTestResultFlag: (testResult: testResultType, patient?: patientInfoType) => testResultFlag;
      units: labTestUnitType[];
    };

export const enum labTestGenerateMethod {
  NORMAL,
  DERIVED,
  STATIC // Always the same value
}

export type labTestGenerateType =
  | {
      method: labTestGenerateMethod.NORMAL;
      mean: (patient?: patientInfoType, testResults?: testResultListType) => number;
      sd: (patient?: patientInfoType, testResults?: testResultListType) => number;
      allowNegative?: boolean;
    }
  | {
      method: labTestGenerateMethod.DERIVED;
      requires?: string[];
      defaults?: { id: string; value: testResultType }[];
      calculate: (testResults: testResultListType, patient?: patientInfoType) => testResultType;
    }
  | {
      method: labTestGenerateMethod.STATIC;
      result: (testResults: testResultListType, patient?: patientInfoType) => testResultType;
    };

export interface labTestType {
  id: string;
  nomenclature: labTestNomenclatureType;
  display: labTestDisplayType;
  generate: labTestGenerateType;
}

export function asNumber(value: any) {
  return typeof value === 'number' ? value : 0;
}

export function asString(value: any) {
  return typeof value === 'string' ? value : '';
}
