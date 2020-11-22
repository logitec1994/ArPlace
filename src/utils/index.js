
const formatAddress = (address) => (
  address.substring(0,4) + '...' + address.substring(address.length-4, address.length)
)

const formatBalance = (balance) => {
  return balance + ' AR'
}

export { 
  formatAddress, 
  formatBalance 
}
