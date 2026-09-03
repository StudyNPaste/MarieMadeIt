
/*import React, { useEffect, useState, useRef } from "react";
import "./Popular.css";
import Item from "../Item/Item";

 
const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef = useRef();
 
  useEffect(() => {
    fetch("https://backend.mariemadeit.com/popularitems")
      .then((res) => res.json())
      .then((data) => {
        setPopularProducts(data);
        setLoading(false);
      });
  }, []);
 
  // ✅ Cursor drag to scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
 
    let isDown = false;
    let startX;
    let scrollLeft;
    let hasDragged = false;
 
    const onDown = (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    };
 
    const onLeave = () => {
      isDown = false;
      track.classList.remove('dragging');
    };
 
    const onUp = () => {
      isDown = false;
      track.classList.remove('dragging');
    };
 
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) {
        hasDragged = true;
      }
      track.scrollLeft = scrollLeft - walk;
    };

    const onClickCapture = (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    };
 
    track.addEventListener('mousedown', onDown);
    track.addEventListener('mouseleave', onLeave);
    track.addEventListener('mouseup', onUp);
    track.addEventListener('mousemove', onMove);
    track.addEventListener('clickcapture', onClickCapture, true);
    track.addEventListener('click', onClickCapture, true);
 
    return () => {
      track.removeEventListener('mousedown', onDown);
      track.removeEventListener('mouseleave', onLeave);
      track.removeEventListener('mouseup', onUp);
      track.removeEventListener('mousemove', onMove);
      track.removeEventListener('clickcapture', onClickCapture, true);
      track.removeEventListener('click', onClickCapture, true);
    };
  }, [loading]);
 
  if (loading) return null;
 
  return (
    <div className="popular">
      <div className="popular-title">
        <h2>Best Sellers</h2>
        <p>Check out our most popular products!</p>
      </div>
 
      
      <div className="popular-track" ref={trackRef}>
        {popularProducts.map((item) => (
          <div className="popular-item" key={item.id}>
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
 
export default Popular;*/


import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Popular.css";
import Item from "../Item/Item";


const Popular = () => {
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const trackRef  = useRef();
  const itemRefs  = useRef([]);

  useEffect(() => {
    fetch("https://backend.mariemadeit.com/popularitems")
      .then((res) => res.json())
      .then((data) => {
        setPopularProducts(data);
        setLoading(false);
      });
  }, []);

  // ── Spotlight height updater ────────────────────────────────
  const updateHeights = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const style = getComputedStyle(document.documentElement);
    const MAX_HEIGHT = parseInt(style.getPropertyValue("--card-max-height"));
    const MIN_HEIGHT = parseInt(style.getPropertyValue("--card-min-height"));

    const trackWidth  = track.clientWidth;
    const spotlightX  = trackWidth * 0.5;  // ~2nd card position, scales with width
    const falloff     = trackWidth * 0.6;   // reaches half the visible track on each side

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

    // Native scroll (touch / trackpad)
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
  }, [loading, updateHeights]);

  // Run once after cards mount so initial heights are set correctly
  useEffect(() => {
    if (!loading) {
      setTimeout(updateHeights, 50);
    }
  }, [loading, updateHeights]);

  if (loading) return null;

  return (
    <div className="popular">
      <div className="popular-title">
        <h2>Best Sellers</h2>
        <p>"Check out our most popular products!"</p>
      </div>

      <div className="popular-track" ref={trackRef}>
        {popularProducts.map((item, index) => (
          <div
            className="popular-item"
            key={item.id}
            ref={(el) => (itemRefs.current[index] = el)}
          >
            <div className="popular-item-inner">
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

export default Popular;