import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import Item from "../Item/Item";
import "./Patterns.css";

const Patterns = () => {
  const { all_product } = useContext(ShopContext);
  const trackRef = useRef();

  const patterns = all_product
    .filter((p) => p.category === "patterns")
    .slice(0, 10)
    .reverse();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    const onDown = (e) => {
      isDown = true;
      hasDragged = false;
      track.classList.add("dragging");
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
    const onLeave = () => { isDown = false; track.classList.remove("dragging"); };
    const onUp = () => { isDown = false; track.classList.remove("dragging"); };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) hasDragged = true;
      track.scrollLeft = scrollLeft - walk;
    };
    const onClickCapture = (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    };

    track.addEventListener("mousedown", onDown);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("mouseup", onUp);
    track.addEventListener("mousemove", onMove);
    track.addEventListener("click", onClickCapture, true);

    return () => {
      track.removeEventListener("mousedown", onDown);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("mouseup", onUp);
      track.removeEventListener("mousemove", onMove);
      track.removeEventListener("click", onClickCapture, true);
    };
  }, [patterns.length]);

  if (patterns.length === 0) return null;

  return (
    <div className="patterns">
      <div className="patterns-header">
        <div>
            <h2>Patterns</h2>
            <p>Digital Crochet Patterns</p>
        </div>
        <Link to="/patterns" className="patterns-viewall">View All →</Link>
      </div>
      <div className="showcase-track" ref={trackRef}>
        {patterns.map((item) => (
          <div className="showcase-item" key={item.id}>
            <Item
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patterns;