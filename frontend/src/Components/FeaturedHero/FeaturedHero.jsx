import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./FeaturedHero.css";

const FeaturedHero = () => {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [animDir, setAnimDir] = useState("");
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch("https://backend.mariemadeit.com/popularitems")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const indexRef = useRef(0);
  const goTo = (nextIndex, dir) => {
    setAnimDir(dir);
    setVisible(false);
    setTimeout(() => {
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setAnimDir("");
      setVisible(true);
    }, 320);
  };

  const prev = () => goTo((index - 1 + items.length) % items.length, "right");
  const next = () => goTo((index + 1) % items.length, "left");

  useEffect(() => {
    if (!items.length) return;
    timerRef.current = setInterval(() => {
      goTo((indexRef.current + 1) % items.length, "left");
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [items.length]);

  if (!items.length) return null;

  const item = items[index];
  const image = item.image_urls?.[0];
  console.log("fileType:", item.fileType, "| madeToOrder:", item.madeToOrder);
  const typeLabel =
    item.fileType?.toLowerCase() === "digital"
      ? "PDF"
      : item.madeToOrder
        ? "Made to Order"
        : "Ready to Ship";

  return (
    <div className="fh-root">
      <div className={`fh-bg ${visible ? "fh-img-in" : "fh-img-out"}`}>
        <img key={item.id} src={image} alt={item.name} />
      </div>
      <div className="fh-left">
        <div
          className={`fh-content ${visible ? "fh-in" : animDir === "left" ? "fh-out-left" : "fh-out-right"}`}
        >
          <p className="fh-type">{typeLabel}</p>
          <h1 className="fh-title">{item.name}</h1>
          <p className="fh-script">Handmade with love ♡</p>
          <p className="fh-desc">
            A unique, handcrafted piece made just for you — carefully crafted
            with quality materials and artisan detail.
          </p>
          <div className="fh-buttons">
            <Link to="/patterns" className="fh-btn fh-btn-dark">
              Shop Patterns
            </Link>
            <Link to='/allproducts' className="fh-btn fh-btn-outline">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
      <div className="fh-right">
        <div className={`fh-card ${visible ? "fh-img-in" : "fh-img-out"}`}>
          <span className="fh-card-badge">{typeLabel}</span>
          <img key={`card-${item.id}`} src={image} alt={item.name} />
        </div>
        <div className="fh-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`fh-dot ${i === index ? "fh-dot-active" : ""}`}
              onClick={() => goTo(i, i > index ? "left" : "right")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="fh-dots-mobile">
        {items.map((_, i) => (
          <button
            key={i}
            className={`fh-dot ${i === index ? "fh-dot-active" : ""}`}
            onClick={() => goTo(i, i > index ? "left" : "right")}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
      <button
        className="fh-arrow fh-arrow-prev"
        onClick={prev}
        aria-label="Previous"
      >
        &#8249;
      </button>
      <button
        className="fh-arrow fh-arrow-next"
        onClick={next}
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
};

export default FeaturedHero;
