import React from 'react'
import './DescriptionBox.css'
import { Link } from 'react-router-dom'
export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (0)</div>
        </div>
        <div className='descriptionbox-description'>
            <p>Every item on this website is handmade by me! If you want any custom made item, send over a PICTURE, COLOR, SIZE, or DESCRIPTION of the item on the <Link to='/custom'>Custom Order</Link> page</p>
        </div>
    </div>
  )
}

export default DescriptionBox
