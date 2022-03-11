namespace DataParser {
  export const accessLevelList: Array<any> = [
    {
      text: 'Fully Verified User',
      value: '5'
    },
    {
      text: 'Identity Verified User',
      value: '4'
    },
    {
      text: 'OTP Verified User',
      value: '3'
    },
    {
      text: 'User',
      value: '2'
    },
    {
      text: 'Guest',
      value: '1'
    }
  ]

  export const auctionTypes = {
    none: 0,
    ended: 1,
    ongoing: 2,
  }
}

export default DataParser
