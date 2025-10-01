import React from "react";
import { assets } from "../assets/assets";
import ShopEaseLogo from '../components/ShopEaseLogo';  

const Footer = () => {
  return (
    <footer className="bg-gray-100 px-6 py-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 object-contain"> <ShopEaseLogo /></div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 text-gray-600 font-medium text-sm md:text-base">
        <a href="/" className="hover:text-orange-600 transition">Home</a>
        <a href="/products" className="hover:text-orange-600 transition">Products</a>
        <a href="/about" className="hover:text-orange-600 transition">About</a>
        <a href="/contact" className="hover:text-orange-600 transition">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <img
          src={assets.instagram_icon}
          alt="Instagram"
          className="w-6 h-6 hover:opacity-80 cursor-pointer"
        />
        <img
          src={assets.facebook_icon}
          alt="LinkedIn"
          className="w-6 h-6 hover:opacity-80 cursor-pointer"
        />
        <img
          src={assets.twitter_icon}
          alt="Pinterest"
          className="w-6 h-6 hover:opacity-80 cursor-pointer"
        />
        <img
          src={assets.twitter_icon}
          alt="WhatsApp"
          className="w-6 h-6 hover:opacity-80 cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default Footer;