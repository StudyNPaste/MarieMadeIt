import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

    const [image,setImage] = useState(false);
    const [productDetails,setProductDetails] = useState({
        name:"",
        image:"",
        color:"",
        size:"S",
        category:"plushies",
        new_price:"",
        old_price:""
    })

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    }
    const changeHandler = (e) =>{
        setProductDetails({...productDetails,[e.target.name]:e.target.value});
    }

    const Add_Product = async ()=>{
        console.log(productDetails);
        let responseData;
        let product = productDetails;

        let formData = new FormData();
        formData.append('product',image);

        await fetch('http://localhost:4000/upload',{
            method:'POST',
            headers:{
                Accept:'application/json',
            },
            body:formData,
        }).then((resp) => resp.json()).then((data)=>{responseData=data});

        if(responseData.success)
        {
            product.image = responseData.image_url;
            console.log(product);
            await fetch('http://localhost:4000/addproduct',{
                method:'POST',
                headers:{
                    Accept:'application/json',
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(product),
            }).then((resp) => resp.json()).then((data)=>{
                data.success?alert('Product Added'):alert("Failed")
            })
        }
    }
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
                <option value="plushies">Plushies</option>
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
                <option value="OSFA">OSFA</option>
            </select>
        </div>
        <div className="addproduct-itemfield">
            <label htmlFor="file-input">
                <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
            <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button>
        </div>
    </div>
  )
}

export default AddProduct