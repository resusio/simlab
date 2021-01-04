import { orderSetType } from '../types/orderSetTypes';

/**
 * An object containing keys for possible order sets. Each key contains an
 * object describing the names for the order set as well as the lab components (or
 * other order sets) that comprise it.
 */
const orderSets: orderSetType[] = [
  {
    id: 'cbc',
    nomenclature: {
      long: 'Complete Blood Count',
      short: 'CBC'
    },
    components: [
      'wbc',
      'rbc',
      'hgb',
      'hct',
      'mcv',
      'rdw',
      'plts',
      'neut',
      'lymph',
      'mono',
      'eosin',
      'baso'
    ]
  },
  {
    id: 'lytes',
    nomenclature: {
      long: 'Electrolytes',
      short: 'Lytes'
    },
    components: ['na', 'cl', 'k', 'hco3', 'ag', 'bun', 'cr', 'gfr', 'gluc']
  },
  {
    id: 'chem7',
    nomenclature: {
      long: 'Chemistry (7-test)',
      short: 'CHEM-7'
    },
    components: ['lytes']
  },
  {
    id: 'coags',
    nomenclature: {
      long: 'Coagulation profile',
      short: 'Coags'
    },
    components: ['inr', 'ptt']
  },
  {
    id: 'basic',
    nomenclature: {
      long: 'Basic Bloodwork',
      short: 'Basic'
    },
    components: ['cbc', 'lytes', 'coags', 'alt']
  },
  {
    id: 'cardiac',
    nomenclature: {
      long: 'Cardiac Bloodwork',
      short: 'Cardiac'
    },
    components: ['basic', 'hstnt']
  },
  {
    id: 'hepatic',
    nomenclature: {
      long: 'Hepatic Panel',
      short: 'Hepatic'
    },
    components: ['alt', 'ast', 'alp', 'ggt', 'lip', 'tbili']
  }
];

export default orderSets;
