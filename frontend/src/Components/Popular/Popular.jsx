import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item'

const Popular = () => {

  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(()=>{
    fetch('https://backend.mariemadeit.com/popularitems')
    .then((response)=>response.json())
    .then((data)=>setPopularProducts(data));
  },[])

  return (
    <div className='popular'>
        <h1>FEATURED</h1>
        <hr />
        <div className="popular-item">
           {popularProducts.map((item, i) => {
              return <Item key={i} id={item.id} name={item.name} size={item.size} color={item.color} image={item.image} new_price={item.new_price} />
           })} 
        </div>
    </div>
  )
}

export default Popular