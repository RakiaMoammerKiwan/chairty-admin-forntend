import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logout } from "../services/authService";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className="fixed top-0 right-0 w-full z-50 bg-[#47B981] shadow-md border-b border-gray-200 py-3 px-6 flex justify-between items-center"
      dir="rtl"
    >
      {/* Right: Logo + App Name */}
      <div className="flex items-center space-x-reverse space-x-4">
        <Link to="/home" className="flex items-center text-gray-800 hover:text-gray-600">
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            className="w-15 h-15 object-contain rounded-full ml-2"
            loading="eager"
          />
          <span className="text-lg text-white font-semibold"> {t("appName")}</span>
        </Link>
      </div>

      <div className="flex items-center space-x-reverse space-x-4">
       <span className="text-lg font-semibold"> {t("navbar.helloAdmin")} </span>
         
      </div>

      {/* Left: Logout button */}
      <button
        onClick={handleLogout}
        className="px-4 py-1.5 border border-gray-400 bg-white rounded hover:bg-gray-100 text-[#47B981] text-sm font-medium"
      >
        {t("navbar.logout")} 
        <i className="mdi mdi-logout mr-2 text-base"></i>
      </button>
    </nav>
  );
};

export default Navbar;