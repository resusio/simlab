export enum gender {
  Male = "M",
  Female = "F",
  Other = "O"
}

export interface patientInfoType {
  age: number;
  height: number;
  weight: number;
  gender: gender;
}
