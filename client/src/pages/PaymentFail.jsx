import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-8">
      <div className="text-red-600 text-6xl mb-4">⚠️</div>
      <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
      <p className="mb-6 text-lg">
        Something went wrong with your transaction. Please try again or contact
        support.
      </p>
      <button
        onClick={() => navigate("/checkout")}
        className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Try Again
      </button>
    </div>
  );
};

export default PaymentFail;
