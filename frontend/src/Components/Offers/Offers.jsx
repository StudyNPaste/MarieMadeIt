import React from 'react'
import './Offers.css'
import prdt2 from '../Assets/product_2.jpg'
import { Link } from 'react-router-dom'

const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <p>Sale !!!</p>
            <h1 style={{fontFamily: 'Protest Riot'}}>Buy one Plushie, get one 50% off!</h1>
            <p>Offers For You</p>
            <button id='sale'><Link
            style={{
              textDecoration: 'none',
              fontFamily: 'Protest Riot',
            }}
            to='/plushies'>Shop Now</Link></button>
        </div>
        <div className="offers-right">
            <img id='plushpic' src={prdt2} alt='' />
        </div>
    </div>
  )
}

export default Offers