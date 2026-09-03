import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Home from './Pages/Home';
import ShopCategory from './Pages/ShopCategory'; 
import Product from './Pages/Product';
//import Custom from './Pages/Custom';
import Cart from './Pages/Cart'
import Checkout from './Pages/Checkout';
import LoginSignup from './Pages/LoginSignup'
import Footer from './Components/Footer/Footer';
import Confirmation from './Pages/Confirmation';
import AllProducts from './Pages/AllProducts';
import ScrollToTop from './Components/ScrollToTop/ScrollToTop';


function App() {
  return (
    <PayPalScriptProvider options={{         // ← wrap here
      "client-id": "ASZPqEyeqJEf_9O2ScaOymhcIi6-iunsi-emYtoT7t4KH2-0NgXSay1ngGu6pdl4PgA_BKUZQhc7-AsZ",
      currency: "USD",
      components: "buttons",
    }}>
      <div>
        <BrowserRouter>
        <ScrollToTop/>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/clothes' element={<ShopCategory category="clothes"/>}/>
          <Route path='/ready-to-ship' element={<ShopCategory category="ready to ship"/>}/>
          <Route path='/patterns' element={<ShopCategory category="patterns"/>}/>
          <Route path='/accessories' element={<ShopCategory category="accessories"/>}/>
          <Route path='/allproducts' element={<AllProducts/>}/>
          <Route path='/product' element={<Product/>}>
            <Route path=':productId' element={<Product/>}/>
          </Route>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/login' element={<LoginSignup/>}/>
        </Routes>
        <Footer />
        </BrowserRouter>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
