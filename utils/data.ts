namespace DataParser {
  export const accessLevelListAdmin: Array<any> = [
    {
      text: 'Root',
      value: '6'
    },
    {
      text: 'Admin',
      value: '5'
    }
  ]

  export const accessLevelList: Array<any> = [
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
