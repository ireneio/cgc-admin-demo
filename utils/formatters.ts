export function numberWithCommas(val: number | string) {
  if (!val) {
    return ''
  }
  // return val.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  return Number(val).toLocaleString()
  // return val
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

export function textFormatDb(val: string) {
  return val.toString().toLowerCase().replaceAll(' ', '_')
}
