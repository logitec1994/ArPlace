import React, { useState, useEffect } from 'react'
import Advert from './Advert'
import { getAllAdverts } from '../utils/arweave'
import Loader from 'react-loader-spinner'
import { Container } from 'react-bootstrap'

const MainPage = () => {
  const [advertsData, setAdvertsData] = useState([])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const data = await getAllAdverts()
    setAdvertsData(data)
  }

  return (
    <Container>
      <h5 style={{paddingTop: '15px'}}>Adverts:</h5>
      <div className="row">
        {advertsData.length > 0 ? advertsData.map(advert => <Advert key={advert.url} advertInfo={advert} />)
        : <div className="loadText">
            <Loader
              type="TailSpin"
              color="#006AD4"
              height={25}
              width={25}
              visible={true}
            /><p style={{marginLeft: '8px'}}>Load all latest adverts....</p>
          </div>
        }
      </div>
    </Container>
  )
}

export default MainPage
