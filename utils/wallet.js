
export const connect = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const obj = {
        status: '👆🏽 Connected.',
        address: addressArray[0],
      };
      return obj
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      }
    }
  } else {
    return {
      address: '',
      status: 'You must install Metamask, a virtual Ethereum wallet, in your browser.',
    }
  }
}

export const isConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: '👆🏽 Connected.',
        };
      } else {
        return {
          address: '',
          status: '🦊 Connect to Metamask using the top right button.',
        };
      }
    } catch (err) {
      return {
        address: '',
        status: '😥 ' + err.message,
      }
    }
  } else {
    return {
      address: '',
      status: 'You must install Metamask, a virtual Ethereum wallet, in your browser.'
    }
  }
}

export function addWalletListener(vm) {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        vm.wallet.connected = false
        vm.wallet.address = ''
        vm.wallet.btnText = 'connect wallet'
      }
    })
  }
}

export function getTrimmedAddressEllipsisMiddle(val, options) {
  if (options) {
    const { length } = options
    return val.substring(0, length - 1) + '...' + val.substring(val.length - 4, val.length)
  }
  return val.substring(0, 5) + '...' + val.substring(val.length - 4, val.length)
}
