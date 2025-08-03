import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import RightMenu from "./RightMenu";
import Layout from "./Layout.scss"

const Layout: React.FC = () => {
  useEffect(() => {
    document.documentElement.dir = "rtl"; // Always RTL
  }, []);

    const currentYear = new Date().getFullYear();
  return (
    <div className="min-h-screen bg-beige text-gray-800 font-cairo flex flex-col">
      <Navbar />
      <div className="flex flex-1 container mx-auto pt-20 relative">
       <main className="flex-grow p-4 max-w-full mr-44">
          <Outlet />
        </main>
        <RightMenu />
      </div>

      <div className="copyright-container font-cairo bg-[#47B981] text-white text-center px-4 py-2">
        <p className="copyright-text">
           جميع الحقوق محفوظة لـ قسم التصميم والتطوير |  IT فريق جمعية يد بيد ©
          <span className="copyright-year"> {currentYear} </span>
        </p>
      </div>

    </div>
  );
};

export default Layout;