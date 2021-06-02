export function numberWithCommas(val: number): string {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function numberWithDollarSign(val: number | string): string {
  return '$' + val
}

export function numberTrimmed(val: number, decimals: number): number {
  return Number(val.toFixed(decimals))
}

export function numberFormatDefault(val: number): string {
  return numberWithDollarSign(numberWithCommas(numberTrimmed(val, 2)))
}
