import React, {useContext, useRef, useState} from "react";
import "./Navbar.css"
import logo from '../Assets/logo.png'
import cart_icon from '../Assets/cart_icon.png'
import menu_icon from '../Assets/menu_icon.png'
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {

    const [menu, setMenu] = useState("home")
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

    return (
        <div className="navbar">
            <div className="nav-logo">
                <Link style={{textDecoration: 'none'}} to='/'>
                    <img id="logo" src={logo} alt="" />
                </Link>
                <div>
                    <h1 className="logo-text">Mariemadeit</h1>
                    <p className="logo-undertext">Handmade Crochet & Patterns</p>
                </div>
            </div>
            <ul ref={menuRef} className="nav-links" >
                <li onClick={()=>{setMenu('home');dropdown_toggle({target: menuRef.current.nextElementSibling.querySelector('.hamburger')})}}><Link style={{textDecoration: 'none'}} to='/'>Home</Link>{menu === "home"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('clothes');dropdown_toggle({target: menuRef.current.nextElementSibling.querySelector('.hamburger')})}}><Link style={{textDecoration: 'none'}} to='/clothes'>Clothes</Link>{menu === "clothes"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('ready to ship');dropdown_toggle({target: menuRef.current.nextElementSibling.querySelector('.hamburger')})}}><Link style={{textDecoration: 'none'}} to='/ready-to-ship'>Ready to Ship</Link>{menu === "ready to ship"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('patterns');dropdown_toggle({target: menuRef.current.nextElementSibling.querySelector('.hamburger')})}}><Link style={{textDecoration: 'none'}} to='/patterns'>Patterns</Link>{menu === "patterns"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('accessories');dropdown_toggle({target: menuRef.current.nextElementSibling.querySelector('.hamburger')})}}><Link style={{textDecoration: 'none'}} to='/accessories'>Accessories</Link>{menu === "accessories"?<hr/>:<></>}</li>
                {/*<li onClick={()=>{setMenu('custom')}}><Link style={{textDecoration: 'none'}} to='/custom'>Custom Order</Link>{menu === "custom"?<hr/>:<></>}</li>*/}
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}><span className="span-login">Logout</span></button>
                :<Link style={{textDecoration: 'none'}} to='/login'><button><span className="span-login">Login</span></button></Link>}
                <div className="cart-and-hamburger">
                    <div className="drop-cart">
                        <Link style={{textDecoration: 'none'}} to='/cart'><img id="cart" src={cart_icon} alt=""/></Link>
                        <div className="nav-cart-count">{getTotalCartItems()}</div>
                    </div>
                    <img className="hamburger" src={menu_icon} alt="menu" onClick={dropdown_toggle} />
                </div>
            </div>
        </div>
    )
}

export default Navbar