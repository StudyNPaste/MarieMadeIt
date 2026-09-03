import React, { useEffect } from "react";
import "./Toast.css";

const Toast = ({ message, show, onClose }) => {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="toast">
      <span className="toast-check">✓</span>
      <span className="toast-text">{message}</span>
    </div>
  );
};

export default Toast;