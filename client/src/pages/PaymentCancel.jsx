// src/pages/PaymentCancel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          ❌ Payment Cancelled
        </h1>
        <p className="text-gray-700 mb-6">
          Your payment was cancelled. You can try again or return to checkout.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;
