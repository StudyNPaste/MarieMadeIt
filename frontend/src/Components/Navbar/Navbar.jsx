import React, {useContext, useRef, useState} from "react";
import "./Navbar.css"
import logo from '../Assets/logo.PNG'
import cart_icon from '../Assets/cart_icon.png'
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import nav_dropdown from '../Assets/nav_dropdown.png'

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
                <p></p>
                </Link>
            </div>
            <img className="nav-dropdown" onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
            <ul ref={menuRef} className="nav-links" >
                <li onClick={()=>{setMenu('home')}}><Link style={{textDecoration: 'none'}} to='/'>Home</Link>{menu === "home"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('clothes')}}><Link style={{textDecoration: 'none'}} to='/clothes'>Clothes</Link>{menu === "clothes"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('plushies')}}><Link style={{textDecoration: 'none'}} to='/plushies'>Plushies</Link>{menu === "plushies"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('accessories')}}><Link style={{textDecoration: 'none'}} to='/accessories'>Accessories</Link>{menu === "accessories"?<hr/>:<></>}</li>
                <li onClick={()=>{setMenu('custom')}}><Link style={{textDecoration: 'none'}} to='/custom'>Custom Order</Link>{menu === "custom"?<hr/>:<></>}</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')
                ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
                :<Link style={{textDecoration: 'none'}} to='/login'><button>Login</button></Link>}
                <Link style={{textDecoration: 'none'}} to='/cart'><img id="cart" src={cart_icon} alt=""/></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    )
}

export default Navbar