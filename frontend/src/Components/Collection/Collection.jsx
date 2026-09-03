import React, { useEffect, useState } from "react";
import "./Collection.css";
import Item from "../Item/Item";

const Collection = () => {
  const [new_collection, setNew_collections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend.mariemadeit.com/newcollections")
      .then((response) => response.json())
      .then((data) => {
        setNew_collections(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <></>;
  }

  return (
    <div className="new-collections">
      <div className="collection-title">
        <h1>All Products</h1>
        <p>"Browse Every Handmade Creation!"</p>
      </div>
      <div className="collections">
        {new_collection?.map((item, i) => {
          return (
            <Item
              className="collection-item"
              key={i}
              id={item.id}
              name={item.name}
              size={item.size}
              color={item.color}
              image={item.image_urls[0]}
              new_price={item.new_price}
              soldOut={item.soldOut}
              madeToOrder={item.madeToOrder}
              fileType={item.fileType}
              quantity={item.quantity}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
