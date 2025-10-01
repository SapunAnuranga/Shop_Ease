import React from "react";
import HeaderSlider from "../components/HeaderSlider";  
import OurProduct from "../components/OurProduct";     

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <HeaderSlider />
      <OurProduct />
    </div>
  );
};

export default Home;