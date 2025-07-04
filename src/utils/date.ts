/**
 * Returns a date object that is three months from the current date.
 * @returns {Date} Date object three months from now.
 */
export const getNextMonth = (): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
};
