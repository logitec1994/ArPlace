import Arweave from 'arweave/web'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,           
  protocol: 'https',  
  timeout: 20000,     
  logging: false,     
})

async function getBalance (wallet) {
	const balance = await arweave.wallets.getBalance(wallet);
	return arweave.ar.winstonToAr(balance)
}

async function getAddress (jwk) {
  const address = await arweave.wallets.jwkToAddress(jwk);
  return address;
}

async function getDataByAddress (address) {
  let txIds = []
  let userData = []
  try {
    let userTxIds = await getTxsGraphAddress(address)
    userTxIds.map(tx => txIds.push(getTxData(tx)))
    const res = await Promise.all(txIds)
    res.map(txType => {
      userData.push(txType)
    })
    return {
      authorAdverts: userData,
      from: address,
    }
  } catch(e) {
    console.log(e)
  }
}


async function createTx(jsonFile, txData) {
  if (!jsonFile || !txData) return { success: false, reason: "No data" }
  let transaction = {};

  try {
    transaction = await arweave.createTransaction({
      data: txData
    }, jsonFile)
    
    transaction.addTag('App-Name', 'Ar-Place')
    transaction.addTag('Type','advert')
    const fee = await arweave.ar.winstonToAr(transaction.reward)
    
    return { 
      success: true,
      data: {
        fee, 
        transaction
      }
    }
  } catch(e) {
    console.log(e)
    return { success: false, reason: e }
  }
}


async function postTx(jsonFile, tx) {
  if (jsonFile && tx) {
    try {     
      await arweave.transactions.sign(tx.data.transaction, jsonFile)
      await arweave.transactions.post(tx.data.transaction)
      return true
    } catch(e) {
      console.error(e)
      return false
    }
  }
}

async function getTxsGraph() {
  const query = {
    query: `
    query {
      transactions(
        first: 20
        tags: [
          { name: "App-Name", values: "Ar-Place" }
          { name: "Type", values: "advert" }
        ]
      ) {
        edges {
          node {
            id
            owner {address}
            tags {
              name
              value
            }
            block {
              id
            }
          }
        }
      }
    }`
  }
  const res = await arweave.api.request().post('https://arweave.dev/graphql', query)
  let data = res.data.data.transactions.edges
  const confirmTxs = data.filter((tx) => tx.node.block)
  const txIds = confirmTxs.map(tx => tx.node.id)
  return txIds
}

async function getTxsGraphAddress(address) {
  const query = {
    query: `
    query {
      transactions(
        first: 20
        tags: [
          { name: "App-Name", values: "Ar-Place" }
          { name: "Type", values: "advert" }
        ]
        owners:"${address}"
      ) {
        edges {
          node {
            id
            owner {address}
            tags {
              name
              value
            }
            block {
              id
            }
          }
        }
      }
    }`
  }
  const res = await arweave.api.request().post('https://arweave.dev/graphql', query)
  const data = res.data.data.transactions.edges
  const confirmTxs = data.filter((tx) => tx.node.block)
  const txIds = confirmTxs.map(tx => tx.node.id)
  return txIds
}
// TO DO , what we gonna do with address?
async function getTxs(type) {
  let arQuery = {}
  if (type === 'profile') {
    arQuery = {
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'App-Name',
        expr2: 'Ar-Place',
      },
      expr2: {
        op: 'equals',
        expr1: 'from',
        expr2: type,
      }
    }
  } else {
    arQuery = {
      op:'and',
      expr1: {
        op: 'equals',
        expr1: 'App-Name',
        expr2: 'Ar-Place',
      },
      expr2: {  
        op: 'equals',
        expr1: 'Type',
        expr2: 'advert',
      }
    }
  }
  try {
    const getTxIds = await arweave.arql(arQuery)
    return getTxIds
  } catch(err){
    return err
  }  
}

async function getTxData (url) {
  const txStatus = await arweave.transactions.getStatus(url)
  if (!txStatus.confirmed) return
  return new Promise(async (resolve,reject) => {
    try {
      const tx = await arweave.transactions.get(url)
      const tags = {};
      const txData = JSON.parse(tx.get('data', {decode: true, string: true}))
      
      tx.get('tags').forEach(tag => {
        tags.key = tag.get('name', {decode: true, string: true})
        tags.value = tag.get('value', {decode: true, string: true})
      })
      const from = await arweave.wallets.ownerToAddress(tx.owner)
      resolve({
        url,
        from,
        txData,
        tags,
      })
      
    } catch (e) {
      reject(e)
    }
  })
}

async function getAllAdverts() {
  let adverts = []
  try {
    const advertData = await getTxsGraph()
    advertData.map(tx => {adverts.push(getTxData(tx))})
    const result = await Promise.all(adverts)
    return result
  } catch (e) {
    console.log(e)
  }
}

export {
  arweave,
  getTxData,
  getAllAdverts,
  createTx,
  postTx,
  getBalance, 
  getAddress,
  getDataByAddress,
}
