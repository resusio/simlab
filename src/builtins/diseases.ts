import { diseaseTreeNode } from '../types/diseaseTypes';

import cvDiseases from './diseases/cv';
import endoDiseases from './diseases/endo';
import traumaDiseases from './diseases/trauma';
import vascDiseases from './diseases/vascular';

const diseases: diseaseTreeNode = {
  id: '', // root node
  children: [
    {
      id: 'cv',
      children: cvDiseases
    },
    {
      id: 'endo',
      children: endoDiseases
    },
    {
      id: 'trauma',
      children: traumaDiseases
    },
    {
      id: 'vasc',
      children: vascDiseases
    }
  ]
};

export default diseases;
