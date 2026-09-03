import React from 'react';
import { Link } from 'react-router-dom'
import './Item.css';
import ItemBadges from '../ItemBadges/ItemBadges';

const Item = (props) => {
  const itemClass = props.soldOut === true ? 'item sold-out' : 'item';

  return (
    <div className={itemClass}>
      <Link to={`/product/${props.id}`} draggable="false" className='item-link'>
        <div className='item-box'>
          <ItemBadges product={props} />
          <img src={props.image} alt='' draggable="false" />
          <div className='item-scrim'></div>
          <div className='item-text'>
            <div className='item-text-left'>
              <p className='name'>{props.name}</p>
              <p className='size'>({props.size}) – {props.color}</p>
            </div>
            <div className="item-prices">
              <div className="item-price-new"><span>$</span>{props.new_price}</div>
              {props.old_price && (
                <div className="item-price-old"><span>$</span>{props.old_price}</div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Item;