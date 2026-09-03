import React from 'react';
import './ItemBadges.css';


const ItemBadges = ({ product }) => {

  const isSoldOut = product.soldOut || (product.fileType === 'physical' && product.quantity === 0);
  const isMadeToOrder = product.madeToOrder;
  const isDigital = product.fileType === 'digital' || product.fileType === 'both';

  if (!isSoldOut && !isMadeToOrder && !isDigital) return null;

  return (
    <div className="item-badges">
      {isSoldOut && (
        <span className="badge badge-soldout">Sold Out</span>
      )}
      {!isSoldOut && isMadeToOrder && (
        <span className="badge badge-madetoorder">Made to Order</span>
      )}
      {isDigital && (
        <span className="badge badge-digital">📄 PDF</span>
      )}
    </div>
  );
};

export default ItemBadges;