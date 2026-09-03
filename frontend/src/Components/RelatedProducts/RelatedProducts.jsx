import React, { useEffect, useState } from "react";
import "./RelatedProducts.css";
import Item from "../Item/Item";

const RelatedProducts = ({ currentProduct }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend.mariemadeit.com/popularitems")
      .then((response) => response.json())
      .then((data) => {
        const related = data
          .filter(
            (item) =>
              item.category === currentProduct?.category &&
              item.id !== currentProduct?.id
          )
          .slice(0, 4);
 
        // ✅ Fallback — if less than 4 in same category, fill with popular items
        if (related.length < 4) {
          const others = data
            .filter(
              (item) =>
                item.category !== currentProduct?.category &&
                item.id !== currentProduct?.id &&
                item.popular === true
            )
            .slice(0, 4 - related.length);
          setRelatedProducts([...related, ...others]);
        } else {
          setRelatedProducts(related);
        }
 
        setLoading(false);
      });
  }, [currentProduct]);
  if (loading) {
    return <></>;
  }

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedProducts?.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              size={item.size}
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

export default RelatedProducts;
