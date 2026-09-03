import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'
import footer_logo from '../Assets/logo.png'
import instagram_icon from '../Assets/instagram_icon.png'
import tiktok_icon from '../Assets/tiktok_icon.png'
import facebook_icon from '../Assets/facebook_icon.png'
import youtube_icon from '../Assets/youtube_icon.png'

const Footer = () => {
  return (
    <div className='footer'>
        <div className="footer-container">
            <div className='footer-left'>
                <div className='footer-logo'>
                    <img className='f-logo' src={footer_logo} alt='' />
                    <div className='logo-title'>
                        <h1>MarieMadeIt</h1>
                        <p>Handmade Crochet & Patterns</p>
                    </div>
                </div>
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
                    <div className="footer-icons-container">
                        <Link to='https://www.youtube.com/@MarieMadeIt96' target='_blank'><img src={youtube_icon} alt='' /></Link>
                    </div>
                </div>
            </div>
            <ul className="footer-links" >
                <li><Link style={{textDecoration: 'none'}} to='/'>Home</Link></li>
                <li><Link style={{textDecoration: 'none'}} to='/clothes'>Clothes</Link></li>
                <li><Link style={{textDecoration: 'none'}} to='/ready-to-ship'>Ready to Ship</Link></li>
                <li><Link style={{textDecoration: 'none'}} to='/patterns'>Patterns</Link></li>
                <li><Link style={{textDecoration: 'none'}} to='/accessories'>Accessories</Link></li>
            </ul>
        </div>
        <div className="footer-copyright">
            <hr />
            <p>Copyright &copy; {new Date().getFullYear()} - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer