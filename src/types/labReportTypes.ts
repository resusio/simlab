// TODO: lab report type with the useful info included (ranges, etc.)

import { labTestNomenclatureType, testResultType } from './labTestTypes';

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
