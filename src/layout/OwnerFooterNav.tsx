import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import home from "@/assets/icons/home-line.svg";
import homeActive from "@/assets/icons/home-line-active.svg";
import receipt from "@/assets/icons/receipt.svg";
import receiptActive from "@/assets/icons/receipt-active.svg";
import mypage from "@/assets/icons/user.svg";
import mypageActive from "@/assets/icons/user-active.svg";

export default function OwnerFooterNav() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const [activeTab, setActiveTab] = useState<
    "home" | "nearby" | "orders" | "mypage"
  >("home");

  useEffect(() => {
    if (routerLocation.pathname.startsWith("/nearby")) setActiveTab("nearby");
    else if (routerLocation.pathname.startsWith("/orders"))
      setActiveTab("orders");
    else if (routerLocation.pathname.startsWith("/mypage"))
      setActiveTab("mypage");
    else setActiveTab("home");
  }, [routerLocation.pathname]);

  const navItems = [
    {
      id: "home",
      label: "홈",
      icon: home,
      activeIcon: homeActive,
      path: "/",
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

  const handleNavClick = (
    id: (typeof navItems)[number]["id"],
    path: string,
  ) => {
    setActiveTab(id);
    navigate(path);
  };

  return (
    <nav className="bg-white border-t border-[#DFDFDF] z-50">
      <div className="flex justify-center gap-[56px] py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id, item.path)}
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
