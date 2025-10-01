import React from "react";

const ShopEaseLogo = ({ width = 150, height = 40 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 150 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shopping Bag Icon */}
      <rect x="5" y="8" width="22" height="24" rx="4" fill="#F97316" />
      <path
        d="M16 8V5a5 5 0 0 1 10 0v3"
        stroke="#1F2937"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Handle lines */}
      <line x1="11" y1="12" x2="21" y2="12" stroke="#1F2937" strokeWidth="2" />

      {/* Text */}
      <text
        x="40"
        y="27"
        style={{
          fill: "#F97316",
          fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
          fontWeight: "700",
          fontSize: "24px",
          userSelect: "none",
        }}
      >
        ShopEase
      </text>
    </svg>
  );
};

export default ShopEaseLogo;
