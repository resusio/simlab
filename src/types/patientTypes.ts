export enum gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export interface patientInfoType {
  age: number;
  height: number;
  weight: number;
  gender: gender;
}
