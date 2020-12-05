export enum gender {
  Male,
  Female,
  Other
}

export interface patientInfoType {
  age: number;
  height: number;
  weight: number;
  gender: gender;
}
