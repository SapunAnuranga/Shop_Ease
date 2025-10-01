import React, { useState, useEffect } from "react";
import { headerAssets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slides = [
  {
    id: 1,
    image: headerAssets.header_headphone_image,
    key: "slide1",
  },
  {
    id: 2,
    image: headerAssets.header_playstation_image,
    key: "slide2",
  },
  {
    id: 3,
    image: headerAssets.header_macbook_image,
    key: "slide3",
  },
];

const HeaderSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[current];

  return (
    <div className="max-w-7xl mx-auto bg-[#e8ecf4] rounded-xl px-4 py-6 my-10 mx-4 sm:mx-10 shadow-sm">
      {/* Dots */}
      <div className="flex justify-center mb-4 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === index ? "bg-orange-500" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Text */}
        <div className="flex-1 md:pr-4 text-center md:text-left">
          <p className="text-sm text-orange-600 font-medium mb-1">
            {t(`slider.${currentSlide.key}.offer`)}
          </p>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug text-gray-800 mb-4 whitespace-pre-line">
            {t(`slider.${currentSlide.key}.title`)}
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => navigate("/products")}
              className="bg-orange-500 text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-orange-600 transition duration-300"
            >
              {t(`slider.${currentSlide.key}.btnText`)}
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center text-gray-700 font-medium hover:text-orange-500 transition duration-300"
            >
              {t(`slider.${currentSlide.key}.linkText`)}
              <img
                src={headerAssets.arrow_icon}
                alt="arrow"
                className="ml-2 w-4 h-4"
              />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src={currentSlide.image}
            alt={t(`slider.${currentSlide.key}.title`)}
            className="w-full max-w-[320px] h-[240px] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderSlider;
