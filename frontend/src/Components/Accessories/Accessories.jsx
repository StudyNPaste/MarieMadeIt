import React, { useEffect, useRef, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import Item from "../Item/Item";
import "./Accessories.css";

const Accessories = () => {
  const { all_product } = useContext(ShopContext);
  const trackRef = useRef();
  const itemRefs = useRef([]);

  const accessories = all_product
    .filter((p) => p.category === "accessories")
    .slice(5, 15)
    .reverse();

  // ── Spotlight height updater ────────────────────────────────
  const updateHeights = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const style      = getComputedStyle(document.documentElement);
    const MAX_HEIGHT = parseInt(style.getPropertyValue("--acc-card-max-height"));
    const MIN_HEIGHT = parseInt(style.getPropertyValue("--acc-card-min-height"));

    const trackWidth = track.clientWidth;
    const spotlightX = trackWidth * 0.5;
    const falloff    = trackWidth * 0.6;

    itemRefs.current.forEach((el) => {
      if (!el) return;
      const cardCenter = el.offsetLeft - track.scrollLeft + el.offsetWidth / 2;
      const distance   = Math.abs(cardCenter - spotlightX);
      const t = Math.max(0, 1 - distance / falloff);
      const h = Math.round(MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * t);
      el.style.height = `${h}px`;
    });
  }, []);

  // ── Drag-to-scroll + spotlight sync ────────────────────────
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let isDown    = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;

    const onDown = (e) => {
      isDown = true;
      hasDragged = false;
      track.classList.add("dragging");
      startX     = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };

    const onLeave = () => { isDown = false; track.classList.remove("dragging"); };
    const onUp    = () => { isDown = false; track.classList.remove("dragging"); };

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) hasDragged = true;
      track.scrollLeft = scrollLeft - walk;
      updateHeights();
    };

    const onClickCapture = (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    };

    const onScroll = () => updateHeights();

    track.addEventListener("mousedown",  onDown);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("mouseup",    onUp);
    track.addEventListener("mousemove",  onMove, { passive: false });
    track.addEventListener("scroll",     onScroll);
    track.addEventListener("click",      onClickCapture, true);

    return () => {
      track.removeEventListener("mousedown",  onDown);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("mouseup",    onUp);
      track.removeEventListener("mousemove",  onMove);
      track.removeEventListener("scroll",     onScroll);
      track.removeEventListener("click",      onClickCapture, true);
    };
  }, [accessories.length, updateHeights]);

  // Init heights after mount
  useEffect(() => {
    setTimeout(updateHeights, 50);
  }, [accessories.length, updateHeights]);

  if (accessories.length === 0) return null;

  return (
    <div className="accessories">
      <div className="accessories-header">
        <div className='accessories-title'>
          <h2>Accessories </h2>
          <p>"Elevate your style with handmade extras!"</p>
        </div>
        <Link to="/accessories" className="accessories-viewall">View All →</Link>
      </div>

      <div className="accessories-track" ref={trackRef}>
        {accessories.map((item, index) => (
          <div
            className="accessories-item"
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <div className="accessories-item-inner">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accessories;