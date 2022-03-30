/**
 * Принимает число и 3 склонения слова (например, ['пункт', 'пункта', 'пунктов']). Возвращает слово с правильным склонением
 * @param {number} n
 * @param {[string]} words
 * @returns {string}
 */
export const getPlural = (number: number, arr: string[]): string => {
  const lastDigits = Math.abs(number) % 100;
  const lastDigit = lastDigits % 10;

  if (lastDigits > 10 && lastDigits < 20) return arr[2];
  if (lastDigit > 1 && lastDigit < 5) return arr[1];
  if (lastDigit === 1) return arr[0];

  return arr[2];
};
