import React from 'react'
import heroVideo from "../Assets/hero.mp4";
import logo from "../Assets/logo.png";
import heroVideoMobile from "../Assets/hero-sm.mp4";
import heroVideoTablet from "../Assets/hero-med.mp4";
import "./Intro.css";

const Intro = () => {
  return (
    <div className='hero-banner'>
        <video autoPlay muted loop playsInline className="hero-video">
          <source src={heroVideoMobile} type="video/mp4" media="(max-width: 768px)" />
          <source src={heroVideoTablet} type="video/mp4" media="(max-width: 1350px)" />
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <img src={logo} alt="Logo" className="hero-logo" />
    </div>
  )
}

export default Intro