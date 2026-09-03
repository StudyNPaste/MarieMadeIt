import instagram from "../Components/Assets/instagram_icon.png";
import youtube from "../Components/Assets/youtube_icon.png";
import facebook from "../Components/Assets/facebook_icon.png";
import "./CSS/Confirmation.css";
import { useEffect, useState } from "react";

const Confirmation = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderNumber = params.get("orderNumber");

        if (!orderNumber) {
          setError("Order number not found in URL");
          setLoading(false);
          return;
        }

        console.log("📦 Fetching order:", orderNumber);

        const response = await fetch(
          `https://backend.mariemadeit.com/order/${orderNumber}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Order not found");
        }

        console.log("✅ Order fetched:", data.order);
        setOrderData(data.order);

        localStorage.removeItem("purchasedItems");
        localStorage.removeItem("currentOrderNumber");
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        setError(err.message || "Failed to load order confirmation");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  const handleDownload = (token, itemName) => {
    console.log(`📥 Downloading: ${itemName}`);
    window.open(`https://backend.mariemadeit.com/download/${token}`, "_blank");
  };

  if (loading) {
    return (
      <div className="confcontainer">
        <div className="confirmation-page">
          <p>Loading your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="confcontainer">
        <div className="confirmation-page">
          <h1>⚠️ Error</h1>
          <p style={{ color: "red" }}>{error}</p>
          <a href="/" className="returnbtn">
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="confcontainer">
        <div className="confirmation-page">
          <p>No order data available</p>
        </div>
      </div>
    );
  }

  const hasDigitalItems = orderData.downloadTokens && orderData.downloadTokens.length > 0;

  return (
    <div className="confcontainer">
      <div className="confirmation-page">
        <h1>🎉 Thank You for Your Purchase!</h1>

        <div className="order-info">
          <h2>Order Confirmation</h2>
          <div className="info-row">
            <span>Order Number:</span>
            <strong>{orderData.orderNumber}</strong>
          </div>
          <div className="info-row">
            <span>Email:</span>
            <span>{orderData.customerEmail || "Not available"}</span>
          </div>
          <div className="info-row">
            <span>Payment Status:</span>
            <span className="status-badge completed">
              ✓ {orderData.paymentStatus?.toUpperCase()}
            </span>
          </div>
          <div className="info-row">
            <span>Order Date:</span>
            <span>{new Date(orderData.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <h3>
          Your order is confirmed! You will receive an email confirmation
          shortly.{" "}
          {hasDigitalItems && (
            <i>
              PDF patterns will be sent to your email separately. (If you
              can't find the email, please check your spam folder.)
            </i>
          )}
        </h3>

        {hasDigitalItems && (
          <div className="digital-downloads">
            <h2>📥 Your Digital Downloads</h2>
            <p>
              A download link has also been sent to{" "}
              <strong>{orderData.customerEmail}</strong>. You can also download
              directly here:
            </p>
            <div className="downloads-list">
              {orderData.downloadTokens.map((item, index) => (
                <div key={index} className="download-item">
                  <p className="download-name">{item.productName}</p>
                  <button
                    className="download-button"
                    onClick={() => handleDownload(item.token, item.productName)}
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {orderData.hasPhysical && (
          <div className="physical-shipment">
            <h2>📦 Physical Items</h2>
            <p>
              You'll receive a tracking number via email once your order ships.
            </p>
          </div>
        )}

        <div className="social-section">
          <h2>
            Stay connected with us by following MarieMadeIt on social media for
            updates, new products, and Pattern tester calls.
          </h2>
          <a
            className="social"
            href="https://www.instagram.com/mariemadeit__/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            <img src={instagram} alt="instagram-logo" />
            Instagram
          </a>
          <a
            className="social"
            href="https://www.youtube.com/@MarieMadeIt96"
            target="_blank"
            rel="noreferrer"
          >
            <img src={youtube} alt="youtube-logo" />
            Youtube
          </a>
          <a
            className="social"
            href="https://www.facebook.com/profile.php?id=100077528543304"
            target="_blank"
            rel="noreferrer"
          >
            <img src={facebook} alt="facebook-logo" />
            Facebook
          </a>
        </div>

        <p>Thank you once again for choosing MarieMadeIt!</p>
        <a className="returnbtn" href="/">
          Return Home
        </a>
      </div>
    </div>
  );
};

export default Confirmation;