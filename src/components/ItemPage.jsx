import React, { useState, useEffect } from 'react'
import { Button, Container, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { getTxData } from '../utils/arweave'
import { formatAddress } from '../utils'

const ItemPage = (props) => {
  const [url, setItemUrl] = useState('')
  const [advertInfo, setAdvertInfo] = useState({})
  const [author, setAuthor] = useState('')
  const [contactVisible, setContactVisible] = useState(false)

  useEffect(() => {
    const { itemUrl } = props.match.params
    getAdvertData(itemUrl)
    setItemUrl(itemUrl)
  }, [])

  const getAdvertData = async (url) => {
    const advertData = await getTxData(url)
    setAuthor(advertData.from)
    setAdvertInfo(advertData.txData)
  }

  return (
    <Container>
      <div className='row advertDetailed'>
        <div className='col-8'>
          <p className='h3'>{advertInfo.name}</p>
          <img style={{marginTop: '15px'}} width='100%' src={advertInfo.image}  alt='advertImg'/>
          <div id='itemBorder'>
            <p className='advertTime'>Location:</p>
            <p>{advertInfo.location}</p>
          </div>
          <div id='itemBorder'>
            <p className='advertTime'>Description:</p>
            <p>{advertInfo.description}</p>
          </div>
          <div id='itemBorder'>
            <p className='advertTime'>Condition:</p>
            <p className='advertType'>{advertInfo.type}</p>
          </div>
        </div>
        <div className='sellerDetailed'>
          <Button className='contactButton' onClick={() => setContactVisible(true)}>Contact Seller</Button>
          <p className='price'>{advertInfo.price || 'loading...'}</p>
          <Link to={`/author/${author}`}>
            <p className='author'>by {formatAddress(author) || 'No author'}</p>
          </Link>
          <p className='date'>Posted: {
            moment(advertInfo.timestamp).format('MMM Do YYYY, h:mm a') || 
            moment(Date.now()).format('MMM Do YYYY, h:mm a')}
          </p>
        </div>
      </div>
      <Modal centered show={contactVisible} onHide={() => setContactVisible(false)}>
        <Modal.Header>
          <p>Seller Info</p>
        </Modal.Header>
        <Modal.Body>
          {!advertInfo.discord && !advertInfo.email ? 
            <p style = {{fontSize: '16px'}}>This is a test advert, there are no contact info.</p> : 
          <div>
            <p style = {{fontSize: '16px'}}>You can contact seller with following info:</p>
            <p><img width='35px' src='https://www.freepnglogos.com/uploads/discord-logo-png/concours-discord-cartes-voeux-fortnite-france-6.png' alt='discordLogo'/>  {advertInfo.discord}</p>
            <p><img width='35px' src='https://cdn.worldvectorlogo.com/logos/gmail-icon.svg' alt='gmailLogo'/>  {advertInfo.email}</p>
          </div>
          }
          </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setContactVisible(false)}>Ok</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ItemPage
