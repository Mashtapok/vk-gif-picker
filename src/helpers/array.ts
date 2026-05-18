/**
 * Returns the correct English plural form (e.g. ['message', 'messages']).
 * @param {number} number
 * @param {[string, string]} arr
 * @returns {string}
 */
export const getPlural = (number: number, arr: [string, string]): string => {
  return Math.abs(number) === 1 ? arr[0] : arr[1];
};
