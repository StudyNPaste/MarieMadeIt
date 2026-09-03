import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/upload_area.svg';

const AddProduct = () => {
    const [images, setImages] = useState([]); // Handle multiple images
    const [pdfFile, setPdfFile] = useState(null); // Handle PDF file
    const [productDetails, setProductDetails] = useState({
        name: "",
        color: "",
        size: "S",
        category: "ready to ship",
        new_price: "",
        old_price: "",
        popular: false,
        madeToOrder: false,
        readyToShip: false,
        soldOut: false,
        quantity: 0,
        fileType: "physical",
    });

    const imageHandler = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const pdfHandler = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
        } else {
            alert('Please select a valid PDF file');
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const Add_Product = async () => {
        console.log("Initial product details (before images):",productDetails);

        let responseData;
        let product = { ...productDetails };

        // Upload images
        let formData = new FormData();
        images.forEach((image, index) => {
            formData.append("products", image);
    });

        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        }).then((resp) => resp.json()).then((data) => { responseData = data });

        if (responseData.success) {
            product.image_urls = responseData.image_urls;

            // Upload PDF if selected
            if (pdfFile && (productDetails.fileType === 'digital' || productDetails.fileType === 'both')) {
                let pdfFormData = new FormData();
                pdfFormData.append("pdf", pdfFile);

                await fetch('http://localhost:4000/upload-pdf', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                    body: pdfFormData,
                }).then((resp) => resp.json()).then((data) => {
                    if (data.success) {
                        product.pdfUrl = data.pdf_url;
                    }
                });
            }

            console.log(product);
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }).then((resp) => resp.json()).then((data) => {
                data.success ? alert('Product Added') : alert("Failed");
            });
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Color</p>
                    <input value={productDetails.color} onChange={changeHandler} type="text" name='color' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="ready to ship">Ready to Ship</option>
                    <option value="patterns">Patterns</option>
                    <option value="accessories">Accessories</option>
                    <option value="clothes">Clothes</option>
                    <option value="custom">Custom</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Size</p>
                <select value={productDetails.size} onChange={changeHandler} name="size" className='add-product-selector'>
                    <option value="XSmall">XS</option>
                    <option value="XS/S">XS/S</option>
                    <option value="Small">S</option>
                    <option value="S/M">S/M</option>
                    <option value="Medium">M</option>
                    <option value="M/L">M/L</option>
                    <option value="Large">L</option>
                    <option value="L/XL">L/XL</option>
                    <option value="XLarge">XL</option>
                    <option value="XL/2XL">XL/2XL</option>
                    <option value="2XLarge">2XL</option>
                    <option value="OS">OS</option>
                    <option value='NA'>N/A</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Inventory Quantity</p>
                <input
                    value={productDetails.quantity}
                    onChange={changeHandler}
                    type="number"
                    name='quantity'
                    placeholder='Enter quantity available'
                    min="0"
                />
            </div>
            <div className="addproduct-itemfield">
                <p>Product Type</p>
                <select value={productDetails.fileType} onChange={changeHandler} name="fileType" className='add-product-selector'>
                    <option value="physical">Physical Product</option>
                    <option value="digital">Digital Product (PDF)</option>
                    <option value="both">Both Physical & Digital</option>
                </select>
            </div>
            {(productDetails.fileType === 'digital' || productDetails.fileType === 'both') && (
                <div className="addproduct-itemfield">
                    <p>Upload PDF File</p>
                    <input
                        onChange={pdfHandler}
                        type="file"
                        accept="application/pdf"
                        name="pdf"
                        id="pdf-input"
                    />
                    {pdfFile && <p style={{color: 'green'}}>PDF selected: {pdfFile.name}</p>}
                </div>
            )}
            <div className='addproduct-itemfield'>
                <p>Made to Order</p>
                <input type="checkbox" name="madeToOrder" checked={productDetails.madeToOrder} onChange={(e) => setProductDetails({...productDetails,madeToOrder: e.target.checked})}/>
            </div>
            <div className='addproduct-itemfield'>
                <p>Ready to Ship</p>
                <input type="checkbox" name="readyToShip" checked={productDetails.readyToShip} onChange={(e) => setProductDetails({...productDetails,readyToShip: e.target.checked})}/>
            </div>
            <div className='addproduct-itemfield'>
                <p>Sold Out</p>
                <input type="checkbox" name="soldOut" checked={productDetails.soldOut} onChange={(e) => setProductDetails({ ...productDetails, soldOut: e.target.checked })}/>
            </div>
            <div className='addproduct-itemfield'>
                <p>Popular</p>
                <input type="checkbox" name="popular" checked={productDetails.popular} onChange={(e) => setProductDetails({ ...productDetails, popular: e.target.checked })}/>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={images.length > 0 ? URL.createObjectURL(images[0]) : upload_area} className='addproduct-thumnail-img' alt="" />
                </label>
                <input
                    onChange={imageHandler}
                    type="file"
                    name="products"
                    id="file-input"
                    hidden
                    multiple
                />
                <div className="image-preview">
                    {images.map((img, index) => (
                        <img key={index} src={URL.createObjectURL(img)} alt={`Preview ${index}`} className="preview-image" />
                    ))}
                </div>
                <button onClick={() => { Add_Product() }} className='addproduct-btn'>Add</button>
            </div>
        </div>
    );
};

export default AddProduct;
