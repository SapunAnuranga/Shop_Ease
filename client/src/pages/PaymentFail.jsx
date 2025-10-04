// src/pages/PaymentFail.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
        <p className="mb-6 text-lg text-gray-600">
          Something went wrong with your transaction. Please try again or contact
          support.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFail;
