import React, { useEffect, useState } from 'react'
import './Collection.css'
import Item from '../Item/Item'

const Collection = () => {

  const [new_collection,setNew_collections] = useState([])

  useEffect(()=>{
    fetch('https://backend.mariemadeit.com/newcollections')
    .then((response)=>response.json())
    .then((data)=>setNew_collections(data));
  },[])

  return (
    <div className='new-collections'>
        <h1>OUR COLLECTION</h1>
        <hr />
        <div className="collections">
            {new_collection.map((item,i) => {
                return <Item key={i} id={item.id} name={item.name} size={item.size} color={item.color} image={item.image} new_price={item.new_price} />
            })}
        </div>
    </div>
  )
}

export default Collection
