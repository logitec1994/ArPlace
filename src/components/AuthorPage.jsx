import React, { useState, useEffect } from 'react'
import Advert from './Advert'
import moment from 'moment'
import { formatAddress } from '../utils'
import { getDataByAddress } from '../utils/arweave'

const defaultAvatar = 'https://ir.ebaystatic.com/pictures/aw/social/avatar.png'

const AuthorPage = (props) => {
  const [authorAdverts, setAuthorAdverts] = useState([])
  const [authorInfo, setAuthorInfo] = useState('')
  const [registered, setRegistered] = useState(Date.now())

  useEffect(() => {
    const { authorUrl } = props.match.params
    getAdvertData(authorUrl)
  }, [])

  const getAdvertData = async (address) => {
    const advertData = await getDataByAddress(address)
    setAuthorAdverts(advertData.authorAdverts)
    setAuthorInfo(advertData.from)
    const timestamps = advertData.authorAdverts.map((advert) => advert.txData.timestamp)
    setRegistered(timestamps.sort().reverse()[0])
  }

  return ( 
    <div className='container'>
      <div className='authorBlock'>
        <img alt='avatarImage' width='200' height='200' src={defaultAvatar} className='authorAvatar' />
        <div className='authorData'>
          <p className='authorInfo'>
            {formatAddress(authorInfo)} has been an ArPlace memeber since
            <span> {moment(registered).format('MMM Do YYYY')}</span>
          </p>
        </div>
      </div>
      <div className='latestPosts'>
        <p className='h4'>Latest {authorInfo} posts:</p>
        <div className="row">
          {authorAdverts.map(advert => <Advert key={advert.image+advert.time} advertInfo={advert} />)}
        </div>
      </div>
    </div>
  )
}

export default AuthorPage
