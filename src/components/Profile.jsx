import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { getDataByAddress } from '../utils/arweave'
import Advert from './Advert'

const Profile = (props) => {
  const [activeAdverts, setActiveAdverts] = useState([])
  const [inactiveAdverts, setInactiveAdverts] = useState([])

  useEffect(() => {
    const { profileUrl } = props.match.params
    getAdvertData(profileUrl)
  }, [])

  const getAdvertData = async (address) => {
    const advertData = await getDataByAddress(address)
    const active = advertData.authorAdverts.filter((advert) => advert.txData.status === 'new')
    const inactive = advertData.authorAdverts.filter((advert) => advert.txData.status !== 'new')
    setActiveAdverts(active)
    setInactiveAdverts(inactive)
  }
  
  return (
    <Container className='profilePage'>
      <h5>Active Adverts ({activeAdverts.length})</h5>
      {activeAdverts.map((advert, index) => <Advert key={index} advertInfo={advert} />)}
      <h5>Inactive Adverts ({inactiveAdverts.length})</h5>
      {inactiveAdverts.map(advert => <Advert key={advert.image+advert.time} advertInfo={advert} />)}
    </Container>
  )
}

export default Profile
