import { diseaseTestOverrideType } from './diseaseTypes';
import { testResultFlag } from './labReportTypes';
import { patientInfoType } from './patientTypes';
import { testResultListType } from './labReportTypes';

export type testResultType = number | string;

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
  id: RegExp;
  unitDisplay: string;
  precision: number;
  convert: (value: testResultType) => testResultType;
}

export interface labTestDisplayFlagComputedType {
  computeTestResultFlag: (testResult: testResultType, patient?: patientInfoType) => testResultFlag;
  units: labTestUnitType[];
}

export interface labTestDisplayFlagParametersType {
  lowLimit: (patient?: patientInfoType) => number;
  highLimit: (patient?: patientInfoType) => number;
  criticalLowLimit?: (patient?: patientInfoType) => number;
  criticalHighLimit?: (patient?: patientInfoType) => number;
  units: labTestUnitType[];
}

export type labTestDisplayType = labTestDisplayFlagComputedType | labTestDisplayFlagParametersType;

export enum labTestGenerateMethod {
  NORMAL,
  DERIVED
}

export type labTestGenerateType = (
  | {
      method: labTestGenerateMethod.NORMAL;
      valueType: 'number';
      mean: (patient?: patientInfoType, testResults?: testResultListType) => number;
      sd: (patient?: patientInfoType, testResults?: testResultListType) => number;
      allowNegative?: boolean;
    }
  | {
      method: labTestGenerateMethod.DERIVED;
      valueType: 'number' | 'string';
      requires?: string[];
      calculate: (testResults: testResultListType, patient?: patientInfoType) => testResultType;
    }
) & {
  neededBy?: string[];
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

export function isNormalGenerator(
  x: labTestType
): x is labTestType & {
  generate: Extract<labTestGenerateType, { method: labTestGenerateMethod.NORMAL }>;
} {
  return x.generate.method === labTestGenerateMethod.NORMAL;
}

export function isDerivedGenerator(
  x: labTestType
): x is labTestType & {
  generate: Extract<labTestGenerateType, { method: labTestGenerateMethod.DERIVED }>;
} {
  return x.generate.method === labTestGenerateMethod.DERIVED;
}
export function isComputedFlag(x: labTestDisplayType): x is labTestDisplayFlagComputedType {
  return (x as labTestDisplayFlagComputedType).computeTestResultFlag !== undefined;
}

export function isParameterFlag(x: labTestDisplayType): x is labTestDisplayFlagParametersType {
  return (
    (x as labTestDisplayFlagParametersType).lowLimit !== undefined &&
    (x as labTestDisplayFlagParametersType).highLimit !== undefined
  );
}
