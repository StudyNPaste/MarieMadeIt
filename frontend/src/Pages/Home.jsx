import React from 'react'
import Hero from '../Components/Hero/Hero'
import Collection from '../Components/Collection/Collection'
import Popular from '../Components/Popular/Popular'
import FeaturedHero from '../Components/FeaturedHero/FeaturedHero'
import Accessories from '../Components/Accessories/Accessories'
import PromoBar from '../Components/PromoBar/PromoBar'

const Home = () => {
  return (
    <div>
      <PromoBar />
      <FeaturedHero />
      <Hero />
      <Popular />
      <Accessories />
      <Collection />
    </div>
  )
}

export default Home