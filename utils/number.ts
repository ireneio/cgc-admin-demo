export function isPositiveInteger(val: string) {
  const _val = Number(val)
  return !isNaN(Number(_val)) && Number(_val) > 0 && !_val.toString().includes('.')
}

export function isPositive(val: string) {
  const _val = Number(val)
  return !isNaN(Number(_val)) && Number(_val) > 0
}

export function isNatural(val: string) {
  const _val = Number(val)
  return !isNaN(Number(_val)) && Number(_val) >= 0
}

export function isInteger(val: string) {
  const _val = Number(val)
  return !isNaN(Number(_val)) && !_val.toString().includes('.')
}

export function isNaturalInteger(val: string) {
  const _val = Number(val)
  return !isNaN(Number(_val)) && Number(_val) >= 0 && !_val.toString().includes('.')
}
