import { diseaseType } from '../types/diseaseTypes';

import cvDiseases from './diseases/cv';
import endoDiseases from './diseases/endo';
import traumaDiseases from './diseases/trauma';
import urologyDiseases from './diseases/urology';
import vascDiseases from './diseases/vascular';

const diseases: diseaseType[] = [
  ...cvDiseases,
  ...endoDiseases,
  ...traumaDiseases,
  ...urologyDiseases,
  ...vascDiseases
];

export default diseases;
