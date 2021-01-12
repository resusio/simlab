// TODO: lab report type with the useful info included (ranges, etc.)

import { labTestNomenclatureType, testResultType, labTestGenerateMethod } from './labTestTypes';
import { patientInfoType } from './patientTypes';

export enum testResultFlag {
  LOW = 'L',
  HIGH = 'H',
  CRITICAL_LOW = 'L!',
  CRITICAL_HIGH = 'H!',
  ABNORMAL = 'A',
  NORMAL = ''
}

export interface testResultWithMetadataType {
  value: testResultType;
  valueType: 'number' | 'string';
  isLocked: boolean;
  generatedType: labTestGenerateMethod;
  nomenclature: {
    short: string;
    long: string;
  };
  display: {
    unitDisplay: string;
    precision: number;
    flag: testResultFlag;
  };
}

// full result type, keyed object containing result and metadata
export interface labTestResultType {
  [testId: string]: testResultWithMetadataType;
}

export interface categoryWithTests {
  name: string;
  testIds: string[];
}

export interface fullTestResultType {
  tests: labTestResultType;
  categories: categoryWithTests[];
}

// keyed object containing just the test results, no metadata
export interface testResultListType {
  [testId: string]: testResultType;
}

export interface serializedReportType {
  patient: patientInfoType;
  testIds: string[];
  orderSetIds: string[];
  diseaseIds: string[];
  lockedTestIds: string[];
  testResults: testResultListType;
}
