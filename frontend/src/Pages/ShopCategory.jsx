import React, { useContext } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";

import Item from "../Components/Item/Item";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  return (
    <div className="shop-category">
      <h1 className="category-text">{props.category}</h1>
      <div className="shopcategory-products">
        {all_product?.map((item, i) => {
          if (props.category === item.category || (props.category === "ready to ship" && item.readyToShip)) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                size={item.size}
                color={item.color}
                image={item.image_urls[0]}
                new_price={item.new_price}
                soldOut={item.soldOut}
                madeToOrder={item.madeToOrder}
                readyToShip={item.readyToShip}
                popular={item.popular}
                fileType={item.fileType}
                quantity={item.quantity}
              />
            );
          } else {
            return null;
          }
        })}<span id="reverse">.reverse()</span>
      </div>
    </div>
  );
};

export default ShopCategory;
