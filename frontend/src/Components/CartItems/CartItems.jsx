import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { checkInventory } from "../../utils/inventoryService";
import PromoInput from "../PromoInput/PromoInput";

const TAX_RATE = 0.087;
const SHIPPING_FEE = 8.99;

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } =
    useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  // ─── Check if any cart items are physical ─────────────────────────────
  // Mirrors exactly what the backend does — drives shipping display
  const hasPhysical = all_product.some(
    (product) =>
      cartItems[product.id] > 0 &&
      (product.fileType === "physical" || product.fileType === "both")
  );

  // ─── Totals ────────────────────────────────────────────────────────────
  const subtotal = getTotalCartAmount();
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const discountedSubtotal = parseFloat((subtotal - discountAmount).toFixed(2));
  const shippingAmount = hasPhysical ? SHIPPING_FEE : 0;
  const taxAmount = parseFloat((discountedSubtotal * TAX_RATE).toFixed(2));
  const totalAmount = parseFloat(
    (discountedSubtotal + shippingAmount + taxAmount).toFixed(2)
  );

  const handlePromoApplied = (promo) => setAppliedPromo(promo);

  const handlePromoRemoved = () => {
    setAppliedPromo(null);
    localStorage.removeItem("appliedPromo");
    localStorage.removeItem("cartTotals");
  };

  const handleCheckout = async () => {
    setIsLoading(true);

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

    try {
      if (cartPayload.length === 0) {
        alert("Your cart is empty. Please add items before proceeding to checkout.");
        setIsLoading(false);
        return;
      }

      const inventoryCheck = await checkInventory(
        cartPayload.map((item) => ({ id: item.id, quantity: item.quantity }))
      );

      if (!inventoryCheck.success) {
        alert("Error checking inventory. Please try again.");
        setIsLoading(false);
        return;
      }

      const unavailableItems =
        inventoryCheck.results?.filter((item) => !item.available) || [];
      if (unavailableItems.length > 0) {
        const unavailableNames = all_product
          .filter((p) => unavailableItems.some((u) => u.id === p.id))
          .map((p) => p.name)
          .join(", ");
        alert(
          `The following items are out of stock: ${unavailableNames}\n\nPlease update your cart and try again.`
        );
        setIsLoading(false);
        return;
      }

      // ─── Save all totals to localStorage ──────────────────────────────
      // Shipping is now included — total here is the real final total
      localStorage.setItem("cartTotals", JSON.stringify({
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
      }));

      if (appliedPromo) {
        localStorage.setItem("appliedPromo", JSON.stringify({
          code: appliedPromo.code,
          discountAmount: appliedPromo.discountAmount,
          description: appliedPromo.description,
          discountType: appliedPromo.discountType,
        }));
      } else {
        localStorage.removeItem("appliedPromo");
      }

      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error during checkout:", error.message);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Color</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.some((e) => cartItems[e.id] > 0) ? (
        all_product.map((e) => {
          if (cartItems[e.id] > 0) {
            return (
              <div key={e.id}>
                <div className="cartitems-format cartitems-format-main">
                  <img
                    src={e.image_urls[0]}
                    alt=""
                    className="carticon-product-icon"
                  />
                  <p>{e.name}</p>
                  <p>{e.color}</p>
                  <p>${e.new_price}</p>
                  <button className="cartitems-quantity">{cartItems[e.id]}</button>
                  <p>${(e.new_price * cartItems[e.id]).toFixed(2)}</p>
                  <img
                    className="cartitems-remove-icon"
                    src={remove_icon}
                    onClick={() => removeFromCart(e.id)}
                    alt="Remove item"
                  />
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })
      ) : (
        <p>Your cart is empty. Add some items to proceed to checkout.</p>
      )}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <PromoInput
              cartTotal={subtotal}
              onPromoApplied={handlePromoApplied}
              onPromoRemoved={handlePromoRemoved}
              appliedPromo={appliedPromo}
            />
            {appliedPromo && discountAmount > 0 && (
              <>
                <div className="cartitems-total-item cartitems-discount">
                  <p>{appliedPromo.description}</p>
                  <p>-${discountAmount.toFixed(2)}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cartitems-total-item">
              <p>Shipping</p>
              <p>{shippingAmount > 0 ? `$${shippingAmount.toFixed(2)}` : "Free"}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Tax</p>
              <p>${taxAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={isLoading}>
            {isLoading ? "Processing..." : "PROCEED TO CHECKOUT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;