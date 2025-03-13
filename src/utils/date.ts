/**
 * Returns a date object that is three months from the current date.
 * @returns {Date} Date object three months from now.
 */
export const getThreeMonthsFromNow = (): Date => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3); // Add three months to the current month.
  return date;
};
