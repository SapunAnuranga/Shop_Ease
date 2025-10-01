import React from "react";

const PaymentCancel = () => {
  return (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">❌ Payment Cancelled</h1>
      <p className="mt-4 text-gray-700">
        Your payment was cancelled. Please try again.
      </p>

      <a
        href="/checkout"
        className="inline-block mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Try Again
      </a>
    </div>
  );
};

export default PaymentCancel;
