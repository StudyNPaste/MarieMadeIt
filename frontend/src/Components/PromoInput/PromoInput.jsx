import React, { useState } from "react";
import "./PromoInput.css";

const PromoInput = ({ cartTotal, onPromoApplied, onPromoRemoved, appliedPromo }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://backend.mariemadeit.com/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), cartTotal }),
      });

      const data = await res.json();

      if (data.valid) {
        onPromoApplied({
          code: data.code,
          discountAmount: data.discountAmount,
          discountType: data.discountType,
          description: data.description,
        });
        setCode("");
      } else {
        setError(data.error || "Invalid promo code");
      }
    } catch (err) {
      setError("Could not validate promo code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setError("");
    setCode("");
    onPromoRemoved();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleApply();
  };

  if (appliedPromo) {
    return (
      <div className="promo-applied">
        <div className="promo-applied-info">
          <span className="promo-check">✓</span>
          <div>
            <span className="promo-applied-code">{appliedPromo.code}</span>
            <span className="promo-applied-desc"> — {appliedPromo.description}</span>
          </div>
        </div>
        <button className="promo-remove-btn" onClick={handleRemove}>
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="promo-input-wrapper">
      <div className="promo-input-row">
        <input
          type="text"
          className="promo-input"
          placeholder="Promo code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="promo-apply-btn"
          onClick={handleApply}
          disabled={loading || !code.trim()}
        >
          {loading ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="promo-error">{error}</p>}
    </div>
  );
};

export default PromoInput;