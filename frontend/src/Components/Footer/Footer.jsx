import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import footer_logo from '../Assets/logo.PNG'
import instagram_icon from '../Assets/instagram_icon.png'
import tiktok_icon from '../Assets/tiktok_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className='footer-logo'>
            <img style={{width: 125, height:125}} src={footer_logo} alt='' />
            <p>MARIE MADE IT</p>
        </div>
        <ul className='footer-links'>
            <li>Products</li>
            <li>Offices</li>
            <li>About</li>
            <li>Contact</li>
        </ul>
        <div className="footer-social-icon">
            <div className="footer-icons-container">
                <Link to='https://www.instagram.com/mariemadeit__/?hl=en' target='_blank'><img src={instagram_icon} alt='' /></Link>
            </div>
            <div className="footer-icons-container">
                <Link to='https://www.tiktok.com/@mariepineapples?_t=8ncIQRO4oec&_r=1' target='_blank'><img src={tiktok_icon} alt='' /></Link>
            </div>
            <div className="footer-icons-container">
                <Link to='https://www.facebook.com/share/c1ntYU9YwXNrgGPb/?mibextid=LQQJ4d' target='_blank'><img src={facebook_icon} alt='' /></Link>
            </div>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright @ 2024 - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer