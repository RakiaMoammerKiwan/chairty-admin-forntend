import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AiOutlineAppstore,
  AiOutlineHome,
  AiOutlineUserAdd,
  AiOutlineTeam,
  AiOutlineMoneyCollect,
  AiOutlinePlusCircle,
  AiOutlineDollarCircle,
  AiOutlineHeart,
  AiOutlineDollar,
  AiOutlineComment,
  AiOutlineUsergroupAdd,
  AiOutlineSolution
} from 'react-icons/ai';
import { BiDonateHeart } from 'react-icons/bi';
import { FiUser } from 'react-icons/fi';
const RightMenu: React.FC = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // دالة لتحديد إذا كان الرابط مفعّلًا
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`sidebar-right bg-[#47B981] border-l border-gray-300 h-full fixed top-14 right-0 pt-4 px-3 overflow-y-auto transition-all duration-300 ${collapsed ? "w-20" : "w-52"
        }`}
      dir="ltr"
    >
      {/* زر الطي */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 border border-gray-400 p-2 rounded-xl shadow-md hover:bg-gray-100 transition-colors z-20"
        aria-label={t("accessibility.collapse_menu") || "طي القائمة"}
      >
        <i
          className={`mdi ${collapsed ? "mdi-chevron-left" : "mdi-chevron-right"} text-gray-700 text-lg`}
          aria-hidden="true"
        ></i>
      </button>

      {/* القائمة */}
      <nav className={`flex flex-col space-y-4 mt-4 ${collapsed ? "items-center" : "items-end"}`}>
        {[
          { to: "/home", icon: <AiOutlineHome size={20} />, label: "الرئيسية" },
          { to: "/projects", icon: <AiOutlineAppstore size={20} />, label: "مشاريع الجمعية" },
          { to: "/addProject", icon: <AiOutlinePlusCircle size={20} />, label: "إضافة مشروع" },
          {
            to: "/addDonationProject",
            icon: <AiOutlineDollarCircle size={20} />,
            label: "إضافة مشروع تبرع"
          },
           {
            to: "/addVolunteerProject",
            icon: <AiOutlineUserAdd size={20} />,
            label: "إضافة مشروع تطوع"
          },
          { to: "/volunteerRequests", icon: <AiOutlineUsergroupAdd size={20} />, label: "طلبات التطوع" },
          {
            to: "/volunteers",
            icon: <AiOutlineTeam size={20} />,
            label: "المتطوعين"
          },
          { to: "/beneficiaryRequests", icon: <AiOutlineSolution size={20} />, label: "طلبات المحتاجين" },
          { to: "/beneficiaries", icon: <BiDonateHeart size={20} />, label: "المحتاجين" },
          // { to: "/requestForm", icon: <BiDonateHeart size={20} />, label: "طلب المحتاج" },
          { to: "/giftDonations", icon: <AiOutlineDollar size={20} />, label: "تبرعات الهدايا" },
          { to: "/beneficiaryFeedback", icon: <AiOutlineComment size={20} />, label: "آراء المستفيدين" },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center text-white hover:text-gray-200 transition-colors px-3 py-2 rounded-md w-full ${collapsed ? "justify-center" : "justify-end"
              } ${isActive(item.to) ? "bg-white/20 font-medium" : ""}`}
          >
            {!collapsed && (
              <span className="mr-2 whitespace-nowrap">{item.label}</span>
            )}

            <span className="flex-shrink-0">{item.icon}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default RightMenu;