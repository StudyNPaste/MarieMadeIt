import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Assets/breadcrum_arrow.png'

const Breadcrum = (props) => {
    const {product} = props;
  return (
    <div className='breadcrum'>
        Home <img className='arrow' src={arrow_icon} alt='' /> Shop <img className='arrow' src={arrow_icon} alt='' /> {product.category} <img className='arrow' src={arrow_icon} alt='' /> {product.name}
    </div>
  )
}

export default Breadcrum