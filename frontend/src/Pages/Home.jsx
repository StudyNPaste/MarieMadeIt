import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import Collection from '../Components/Collection/Collection'
import NewsLetter from '../Components/NewsLetter/NewsLetter'

const Home = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Offers />
      <Collection />
      <NewsLetter />
    </div>
  )
}

export default Home