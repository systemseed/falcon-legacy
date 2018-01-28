/**
 * Returns currency symbol by given currency code.
 *
 * @param currencyCode
 * @returns string
 */
export function getCurrencySymbol(currencyCode) {
  if (currencyCode == 'gbp') {
    return '£';
  }
  return '€';
}
