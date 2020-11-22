import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { formatAddress } from '../utils'

const Advert = (props) => {
  const { image, name, price, time, location } = props.advertInfo.txData
  const { url, from } = props.advertInfo
  const arPrice = sessionStorage.getItem('arPrice')

  return (
      <div className="advert">
        <Link to={`/item/${url}`}>
          <div className="advertImg">
            <img width="100%" heigth="100%" alt="advertImage" src={image} />
          </div>
          <div className="advertTextInfo">
            <div>
              <p className='advertName'>{name}</p>
              <p className='adverPrice'>{price} 
                <span style={{marginLeft: '5px', fontSize: '15px', color: '#a3a3a3'}}>({(price.split(' ')[0]/arPrice).toFixed(2)} AR)</span>
              </p>
              <p className='advertTime'>{moment(time).format('MMM Do YYYY, h:mm a')}</p>
            </div>
            <div className="locationAuthor">
              <span>{location}</span>
              <p>
                <span>by </span>
                <Link to={`/author/${from}`}>{formatAddress(from)}</Link>
              </p>
            </div>
          </div>
        </Link>
      </div>
    
  )
}

export default Advert
