import React, { useContext, useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { ShopContext } from "../Context/ShopContext";
import "./CSS/Checkout.css";

const Checkout = () => {
  const { all_product, cartItems } = useContext(ShopContext);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);

  let appliedPromo = null;
  let cartTotals = null;
  try {
    const storedPromo = localStorage.getItem("appliedPromo");
    const storedTotals = localStorage.getItem("cartTotals");
    if (storedPromo) appliedPromo = JSON.parse(storedPromo);
    if (storedTotals) cartTotals = JSON.parse(storedTotals);
  } catch (e) {
    console.warn("Could not read from localStorage");
  }

  // ─── Cart payload ──────────────────────────────────────────────────────
  const cartPayload = all_product
    .filter((product) => cartItems[product.id] > 0)
    .map((product) => ({
      id: product.id,
      name: product.color
        ? `${product.name} - ${product.color}`
        : product.name,
      quantity: cartItems[product.id],
      price: product.new_price,
    }));

  
  const subtotal = cartTotals?.subtotal
    ?? cartPayload.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = cartTotals?.discountAmount ?? 0;
  const taxAmount = orderData?.taxAmount ?? cartTotals?.taxAmount ?? 0;
  const shippingAmount = cartTotals?.shippingAmount ?? 0;
  const totalAmount = orderData?.totalAmount ?? cartTotals?.totalAmount ?? subtotal;

  const createOrder = async () => {
    setError(null);
    try {
      const response = await fetch(
        "https://backend.mariemadeit.com/create-checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: cartPayload,
            promoCode: appliedPromo?.code || null,
            discountAmount: cartTotals?.discountAmount || 0,
            discountDescription: appliedPromo?.description || null,
            taxAmount: cartTotals?.taxAmount || 0,
            totalAmount: cartTotals?.totalAmount || null,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Checkout created:", data);


      setOrderData(data);

      localStorage.setItem("orderNumber", data.orderNumber);
      localStorage.setItem("purchasedItems", JSON.stringify(data.cart));

      return data.orderID;
    } catch (err) {
      console.error("❌ createOrder error:", err);
      setError(err.message || "Failed to create order. Please try again.");
      throw err;
    }
  };

  const onApprove = async (data) => {
    try {
      const orderNumber = localStorage.getItem("orderNumber");
      const cart = JSON.parse(localStorage.getItem("purchasedItems") || "[]");

      const captureResponse = await fetch(
        "https://backend.mariemadeit.com/capture-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID, orderNumber, cart }),
        }
      );

      const captureData = await captureResponse.json();
      if (!captureData.success) throw new Error(captureData.error || "Capture failed");

      console.log("🎉 Order captured:", captureData);

      localStorage.setItem("currentOrderNumber", captureData.orderNumber);
      localStorage.setItem("customerEmail", captureData.customerEmail);
      localStorage.removeItem("purchasedItems");
      localStorage.removeItem("appliedPromo");
      localStorage.removeItem("cartTotals");
      localStorage.removeItem("orderNumber");

      window.location.href = `/confirmation?orderNumber=${captureData.orderNumber}`;
    } catch (err) {
      console.error("❌ Capture error:", err);
      setError(`Payment capture failed: ${err.message}`);
    }
  };

  if (cartPayload.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-error">
          <h2>Your cart is empty</h2>
          <a href="/cart" className="checkout-back-btn">Return to Cart</a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <h1>Complete Your Purchase</h1>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartPayload.map((item, index) => (
              <div key={index} className="summary-item">
                <span>{item.name}</span>
                <span>{item.quantity}x ${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row summary-discount">
                <span>{appliedPromo?.description || "Promo discount"}:</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping:</span>
              <span>
                {shippingAmount > 0 ? `$${shippingAmount.toFixed(2)}` : "Free"}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          {orderData && !orderData.hasPhysical && (
            <p className="digital-note">
              📥 No shipping required — digital items will be sent to your email
            </p>
          )}
        </div>

        {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

        {/* ─── PayPal Buttons ─── */}
        <div className="paypal-section">
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error("❌ PayPal error:", err);
              setError("Payment failed. Please try again.");
            }}
            style={{ layout: "vertical", color: "silver", shape: "pill" }}
          />
        </div>

        <a href="/cart" className="checkout-back-btn">
          ← Return to Cart
        </a>
      </div>
    </div>
  );
};

export default Checkout;