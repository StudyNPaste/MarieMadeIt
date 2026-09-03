import React, { useState, useEffect, useContext } from 'react';
import './ProductDisplay.css';
import star_icon from "../Assets/star_icon.png";
import { ShopContext } from '../../Context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Description from '../DescriptionBox/DescriptionBox';
import Toast from '../Toast/Toast';

const ProductDisplay = (props) => {
    const { product } = props;
    const { addToCart, all_product } = useContext(ShopContext);
    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const isSoldOut = product.soldOut ||
        (product.fileType === 'physical' && product.quantity === 0);

    const colorVariants = all_product.filter(
        (p) => p.name === product.name && p.color
    );

    const hasColorVariants = colorVariants.length > 1;
    const [mainImage, setMainImage] = useState(product.image_urls[0]);

    useEffect(() => {
        setMainImage(product.image_urls[0]);
    }, [product]);

    const handleImageClick = (clickedImage) => setMainImage(clickedImage);

    const handleColorChange = (e) => {
        const selectedColor = e.target.value;
        const selectedProduct = colorVariants.find(p => p.color === selectedColor);
        if (selectedProduct) navigate(`/product/${selectedProduct.id}`);
    };

    const handleAddToCart = () => {
        if (isSoldOut) return;
        addToCart(product.id);
        setShowToast(true);
    };

    return (
        <div className='productdisplay'>

            <Toast
                show={showToast}
                message="Added to cart!"
                onClose={() => setShowToast(false)}
            />

            <div className='productdisplay-left'>
                <div className='productdisplay-img-list'>
                    {product.image_urls.slice(0, 4).map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt=""
                            onClick={() => handleImageClick(img)}
                            className="thumbnail-img"
                        />
                    ))}
                </div>
                <div className='productdisplay-img'>
                    <img className='productdisplay-main-img' src={mainImage} alt="" />
                </div>
            </div>

            <div className='productdisplay-right'>
                <h1 id='itemname'>{product.name}</h1>
                <div className='productdisplay-right-stars'>
                    {[...Array(5)].map((_, index) => (
                        <img key={index} src={star_icon} alt="" />
                    ))}
                    <p>(0)</p>
                </div>
                <div className='productdisplay-right-prices'>
                    <div className='productdisplay-right-price-old'></div>
                    <div className='productdisplay-right-price-new'>${product.new_price}</div>
                </div>

                {hasColorVariants && (
                    <div className="productdisplay-right-colors">
                        <h1>Color</h1>
                        <select
                            className="color-dropdown"
                            value={product.color || ''}
                            onChange={handleColorChange}
                        >
                            {colorVariants.map((variant) => (
                                <option
                                    key={variant.id}
                                    value={variant.color}
                                    disabled={variant.soldOut}
                                >
                                    {variant.color}{variant.soldOut ? ' — Sold Out' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {!hasColorVariants && product.color && (
                    <div className="productdisplay-right-colors">
                        <h1>Color</h1>
                        <p>{product.color}</p>
                    </div>
                )}

                <div className="productdisplay-right-size">
                    <h1>Size</h1>
                    <div className="productdisplay-right-sizes">
                        <h1>{product.size}</h1>
                    </div>
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={isSoldOut}
                    className={isSoldOut ? 'btn-soldout' : ''}
                >
                    <span>{isSoldOut ? 'SOLD OUT' : 'ADD TO CART'}</span>
                </button>

                <p className="productdisplay-right-category">
                    <span>Category :</span> {product.category}
                </p>
                <p className="productdisplay-right-category">
                    <span>Tags :</span> Handmade, Crochet
                </p>
            </div>

            <Description />
        </div>
    );
};

export default ProductDisplay;