/**
 * Contains a numeric value for each category that indicates the order in which that
 * category should be displayed (lowest to highest). This is to allow consistent
 * appearing lab reports.
 */
const categories = [
  { categoryName: 'Hematology', sortIndex: 10 },
  { categoryName: 'Coagulation', sortIndex: 20 },
  { categoryName: 'Chemistry', sortIndex: 30 },
  { categoryName: 'Renal Function', sortIndex: 40 },
  { categoryName: 'Cardiac', sortIndex: 50 },
  { categoryName: 'Hepatology', sortIndex: 60 }
];

export default categories;
