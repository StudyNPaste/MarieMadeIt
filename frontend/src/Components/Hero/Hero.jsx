import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import hero_img2 from '../Assets/bigheroimg.jpeg'
import hero_img3 from '../Assets/product_37.png'
import hero_img4 from '../Assets/bloomers.jpg'
import hero_img5 from '../Assets/product_3.jpg'

const categories = [
  {
    label: 'Clothes',
    path: '/clothes',
    img: hero_img2,
  },
  {
    label: 'Ready to Ship',
    path: '/ready-to-ship',
    img: hero_img5,
  },
  {
    label: 'Patterns',
    path: '/patterns',
    img: hero_img4,
  },
  {
    label: 'Accessories',
    path: '/accessories',
    img: hero_img3,
  },
]

const Hero = () => {
  return (
    <section className="hero-section">
      <h2 className="hero-heading">
        <span className="hero-deco"></span>
        SHOP BY CATEGORY
        <span className="hero-deco"></span>
      </h2>

      <div className="hero-grid">
        {categories.map(({ label, path, img,}) => (
          <Link to={path} className="hero-card" key={label}>
            <div className="hero-card-text">
              <p className="hero-card-label">{label}</p>
              <p className="hero-card-cta">Shop Now →</p>
            </div>
            <div className="hero-card-img">
              <img src={img} alt={label} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Hero