import React, { useState } from 'react'
import { Modal, Container, Form, Button } from 'react-bootstrap'
import { createTx, postTx } from '../utils/arweave'
import  LoadImage  from '../utils/LoadImage.js'

const CreateAdvert = (props) => {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [discord, setDiscord] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [errVisible, setErrVisible] = useState(false)
  const [errText, setErrText] = useState('')
  const [confirmTxVisible, setConfirmTxVisible] = useState(false)
  const [successTxVisible, setSuccesTxVisible] = useState(false)
  const [tx, setTx] = useState('')
  const [txFee, setTxFee] = useState('')
  const [arPriceusd, setArPriceUsd] = useState('')

  const publishAdvert = async () => {
    if (!name || !image || !price || !description || !location || !type) {
      setErrVisible(true)
      setErrText('Please provide advert name, price, description, your location and some images before submit.')
      return
    }
    if (!discord && !email) {
      setErrVisible(true)
      setErrText('Please provide some contact info, potential buyers should be able to contact you. You may put only discord or only email contact data.')
      return
    }
    const tx = await getTx()
    if (!tx) return
    setTx(tx)
    setTxFee(tx.data.fee)
    const balance = await sessionStorage.getItem('balance')
    const arPrice = await sessionStorage.getItem('arPrice')
    setArPriceUsd(arPrice)
    // maybe we wanna get real AR price and save it somewhere to show USD value also
    if (tx.data.fee > balance) {
      setErrText(`Insufficient balance. Transaction Fee (${tx.data.fee} AR) is more than your current balance.`)
      setErrVisible(true)
      return
    }
    setConfirmTxVisible(true)

  }

  const getTx = async () => {
    const userData = await sessionStorage.getItem('walletData')
    const txData = JSON.stringify({
      name,
      image,
      price,
      description,
      location,
      type,
      timestamp: Date.now(),
      discord,
      email,
      status: 'new',
    })
    const tx = await createTx(JSON.parse(userData), txData)
    if (tx.success) return tx
    setErrVisible(true)
    setErrText('Error during transaction creating, please try another data')
    return
  }

  const confrimTx = async (e) => {
    setConfirmTxVisible(false)
    let userData = sessionStorage.getItem('walletData')
    userData = JSON.parse(userData)
    const isValid = await postTx(userData, tx);
    if (!isValid) {
      setErrVisible(true)
      setErrText('Transaction Failed, please try again')
      return
    }
    setSuccesTxVisible(true)
  }

  const handleImgImport = async (e) => {
    const imgUrl = await LoadImage(e.target.files[0])
    setImage(imgUrl)
  }

  return (
    <Container className="createAdvert">
      <h3 style={{paddingTop: '25px', paddingBottom: '25px'}}>Post advert on ArPlace</h3>
      <Form>
        <Form.Group className="formGroup nameAndPrice">
          <Form.Label>Name</Form.Label>
          <Form.Control
            className='formInput'
            value={name} 
            onInput={(e) => setName(e.target.value)}
            placeholder="Enter name" type="text"
          />
          {/* validate somehow price */}
          <Form.Label style={{paddingTop: '10px'}}>Price</Form.Label>
          <Form.Control
            className='formInput'
            value={price} 
            onInput={(e) => setPrice(e.target.value)}
            placeholder="Enter price" type="text"
          />
        </Form.Group>
        <Form.Group className='formGroup'>
          {/* might be at least 80 symbols */}
          <Form.Label>Description</Form.Label>
          <Form.Control
            className='formInput'
            as="textarea" 
            rows={5}
            value={description} 
            onInput={(e) => setDescription(e.target.value)}
            placeholder="Enter short description here" type="text"
          />
          <Form.Label style={{paddingTop: '10px'}}>Location</Form.Label>
          <Form.Control
            className='formInput'
            value={location}
            onInput={(e) => setLocation(e.target.value)}
            placeholder="Enter location" type="text"
          />
          <Form.Label style={{paddingTop: '10px'}}>Type</Form.Label>
          <div className='advertType'>
            <Form.Check 
              checked={type === 'new'}
              onChange={() => setType('new')}
              type="checkbox"
              label="New"
            />
            <Form.Check
              checked={type === 'used'}
              onChange={() => setType('used')}
              style={{marginLeft: '10px'}}
              type="checkbox"
              label="Used" 
            />
          </div>
        </Form.Group>
        <Form.Group className='formGroup'>
          <Form.Label>Contact Info</Form.Label>
          <div style={{display: 'flex'}}>
            <img src='https://www.freepnglogos.com/uploads/discord-logo-png/concours-discord-cartes-voeux-fortnite-france-6.png' width='38px' alt='discordLogo' />
            <Form.Control
              style={{marginLeft: '10px'}}
              className='formInput'
              value={discord}
              onInput={(e) => setDiscord(e.target.value)}
              placeholder="Enter your discord" type="text"
            />
          </div>
          <div style={{display: 'flex', paddingTop: '10px'}}>
            <img src='https://cdn.worldvectorlogo.com/logos/gmail-icon.svg' width='38px' alt='gmailLogo' />
            <Form.Control
              style={{marginLeft: '10px'}}
              className='formInput'
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" type="text"
            />
          </div>
        </Form.Group>
        <Form.Group className='formGroup'>
          <Form.Label>Images</Form.Label>
          <div className="emptyImageBlock">
            {!image  ? 
              <img className='imgEmpty' src='https://simpleicon.com/wp-content/uploads/camera.png' alt='emptyImage'/> :
              <img className='imgAdvert' src={image} alt='advertImage'/>
            }
            <input type="file"  accept="image/*" id='fileImport' onChange = {(e) => handleImgImport(e)}/>
          </div>
        </Form.Group>
      </Form>
      {/* modal during error */}
      <Modal centered show={errVisible} onHide={() => setErrVisible(false)}>
        <Modal.Header>
          <p>Cannot publish advert</p>
        </Modal.Header>
        <Modal.Body>
          <p>{errText}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setErrVisible(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
      {/* confirm tx */}
      <Modal centered show={confirmTxVisible} onHide={() => setConfirmTxVisible(false)}>
        <Modal.Header>
          <p>Confrim Transaction</p>
        </Modal.Header>
        <Modal.Body>
          <p style = {{fontSize: '16px'}}>This is your tx cost:</p>
          <p style={{fontSize: '18px',fontWeight: 'bold'}}> {txFee} AR.</p>
          <p style={{fontSize: '16px', color: '#ccc'}}> ({arPriceusd*txFee} USD)</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setConfirmTxVisible(false)}>Cancel</Button>
          <Button onClick={() => confrimTx()}>Confirm</Button>
        </Modal.Footer>
      </Modal>
      {/* success transaction */}
      <Modal centered show={successTxVisible} onHide={() => setSuccesTxVisible(false)}>
        <Modal.Header>
          <p>Transaction Complete</p>
        </Modal.Header>
        <Modal.Body>
          <p style = {{fontSize: '16px'}}>Transaction send, please wait the confirmations to view your advert on the ArPlace.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setSuccesTxVisible(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
      <div className='publishButton'>
        <Button style={{width:'200px'}} onClick={() => publishAdvert()}>Publish Advert</Button>
      </div>
    </Container>
  )
}

export default CreateAdvert
