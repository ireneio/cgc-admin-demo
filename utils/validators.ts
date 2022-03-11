namespace Validators {
  export function isValidPrice(val: string) {
    return !isNaN(Number(val.replaceAll(',', '')))
  }
}

export default Validators
