// components/FooterNav.tsx
import { useNavigate, useLocation } from "react-router-dom";

import home from "@/assets/icons/home-line.svg";
import homeActive from "@/assets/icons/home-line-active.svg";
import location from "@/assets/icons/location-nav.svg";
import locationActive from "@/assets/icons/location-active.svg";
import receipt from "@/assets/icons/receipt.svg";
import receiptActive from "@/assets/icons/receipt-active.svg";
import mypage from "@/assets/icons/user.svg";
import mypageActive from "@/assets/icons/user-active.svg";

export default function FooterNav() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  type ActiveTab = "home" | "nearby" | "orders" | "mypage";
  const getActiveTab = (): ActiveTab => {
    const pathname = routerLocation.pathname;
    if (pathname.startsWith("/nearby")) return "nearby";
    if (pathname.startsWith("/orders")) return "orders";
    if (pathname.startsWith("/mypage")) return "mypage";
    return "home";
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: "home", label: "홈", icon: home, activeIcon: homeActive, path: "/" },
    {
      id: "nearby",
      label: "내 주변",
      icon: location,
      activeIcon: locationActive,
      path: "/nearby",
    },
    {
      id: "orders",
      label: "주문 내역",
      icon: receipt,
      activeIcon: receiptActive,
      path: "/orders",
    },
    {
      id: "mypage",
      label: "마이페이지",
      icon: mypage,
      activeIcon: mypageActive,
      path: "/mypage",
    },
  ] as const;

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bg-white border-t border-[#DFDFDF] z-50">
      <div className="flex justify-center gap-[32px] py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)} // id 대신 path만 전달
            className="flex flex-col items-center text-[12px] font-medium text-[#7F7F7F] cursor-pointer w-[60px]"
          >
            <img
              src={activeTab === item.id ? item.activeIcon : item.icon}
              alt={item.label}
              className="w-6 h-6 mb-1"
            />
            <span
              className={
                activeTab === item.id ? "text-[#FE7549] font-semibold" : ""
              }
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
