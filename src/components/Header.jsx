import React, { useState, useEffect } from 'react'
import { Modal, Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LoadWallet from '../utils/LoadWallet.js'
import { arweave, getBalance } from '../utils/arweave.js'
import { formatAddress, formatBalance } from '../utils'

const Header = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [balance, setBalance] = useState(0)
  const [address, setAddress] = useState('')
  const [arUsd, setArUsd] = useState('')

  useEffect(() => {
    // sessionStorage.clear()
    const isLogin = sessionStorage.getItem('isLogin')
    if (isLogin) {
      const balance = sessionStorage.getItem('balance')
      const address = sessionStorage.getItem('address')
      setIsLogin(isLogin)
      setBalance(balance)
      setAddress(address)
    }
  }, [])

  useEffect(() => {
    const arPrice = sessionStorage.getItem('arPrice')
    if (!arPrice) {
      (async () => {
        const arUsd = await getArPrice()
        sessionStorage.setItem('arPrice', arUsd)
        setArUsd(arUsd)
      })()
    } else {
      setArUsd(arPrice)
    }
  }, [])

  const getArPrice = async () => {
    const arJson = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd')
    const { arweave } = await arJson.json()
    if (arweave) return arweave.usd
    return { error: true, reason: "cannot get ar price"}
  }

  const handleChangeInput = async (e) => {
    try {
      const wallet = await LoadWallet(e.target.files[0])
      const walletData = JSON.parse(wallet)
      const address = await arweave.wallets.jwkToAddress(walletData)
      const balance = await getBalance(address)
      setIsLogin(true)
      setBalance(balance)
      setAddress(address)
      // save data
      // sessionStorage.setItem('arUsd', JSON.stringify(arPrice.arweave.usd))
      sessionStorage.setItem('address', address)
      sessionStorage.setItem('balance', balance)
      sessionStorage.setItem('walletData', JSON.stringify(walletData))
      sessionStorage.setItem('isLogin', true)
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <div className="headerWrapper">
      <Container>
        <div className="container header row" style={{justifyContent: 'space-between', alignItems: 'center', alignContent: 'center'}}>
          <div className="row">
            <Link to="/main">
              <p className="logoText">ArPlace</p>
            </Link>
          </div>
          {isLogin ? 
            <div className='row'>
              <Link to='/create-advert'>
                <Button>Create New Advert</Button>
              </Link>
              <div className='userBalance'>
                {/* author name or balance */}
                <p>{formatAddress(address)}</p>
                <p className='arBalance'>{formatBalance(balance)}
                  <span className='arBalanceUsd'>({(balance*arUsd).toFixed(2)} USD)</span>
                </p>
              </div>
              <Link to={`/profile/${address}`}>
                <Button style={{marginLeft: '10px'}}>My Profile</Button>
              </Link>
            </div>
          : <div>
              <Button onClick={() => setLoginVisible(true)}>Login</Button>
              <Modal centered show={loginVisible} onHide={() => setLoginVisible(false)}>
                <Modal.Header>
                  Login to ArPlace
                </Modal.Header>
                <Modal.Body>
                  <div className="row">
                    <div className="col s12">
                      <div className="file-input">
                        <input type="file" id="keyfile" onChange = {(e) => handleChangeInput(e)}/>
                        <p>Drop a keyfile to login</p>
                      </div>
                    </div>
                  </div>
                </Modal.Body>
              </Modal>

            </div>
          }
        </div>
      </Container>
    </div>
  )
}

export default Header
