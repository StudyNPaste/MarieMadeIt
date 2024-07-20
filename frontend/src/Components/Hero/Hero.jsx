import React from 'react'
import './Hero.css'
import arrow_icon from '../Assets/arrow.png'
import hero_img2 from '../Assets/product_10.jpg'
import hero_img1 from '../Assets/product_12.jpeg'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS</h2>
            <div>
                <div className="hero-text">
                    <p style={{fontFamily: 'Raleway'}}>Just <span className='hero-color'>Dropped.</span></p>
                </div>
                <p id='new-items'>Check out the latest items!</p>
            </div>
            <div className="hero-latest-btn">
                <div>Shop Now</div>
                <img src={arrow_icon} alt=''/>
            </div>
        </div>
        <div className='hero-right-background'>
        <div className="hero-right">
            <img id='hroimg1' src={hero_img1} alt='' width={550} height={700}/>
            <img id='hroimg2' src={hero_img2} alt='' width={550} height={700}/>
        </div>
        </div>
    </div>
  )
}

export default Hero