// Home.tsx
import React, { useMemo } from "react";
import { MENUS } from "@/Mock/menudatas";
import { CATEGORY } from "./constants/Category";
import MenuCard from "./components/MenuCard";
import Carousel from "./components/Carousel";
import { useNavigate } from "react-router-dom";
import FooterNav from "./layout/FooterNav";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const topDiscountMenus = useMemo(() => {
    return [...MENUS]
      .sort((a, b) => b.discountRate - a.discountRate)
      .slice(0, 6);
  }, []);

  return (
    <div className="relative">
      {/* Carousel - 부모의 padding을 무시하고 전체 너비 사용 */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="max-w-[401px] mx-auto">
          <Carousel />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-x-[16px] gap-y-[16px] mt-[16px]">
        {CATEGORY.map((category) => (
          <div
            key={category.slug}
            onClick={() => navigate(`/category/${category.slug}`)}
            className="w-[72px] cursor-pointer"
          >
            <div className="w-[72px] h-[72px] bg-[#D9D9D9]"></div>
            <span className="text-[14px] font-[500] flex justify-center mt-[8px]">
              {category.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[24px] mt-[32px] mb-[84px]">
        <span className="text-[20px] font-bold">할인율 높은 음식</span>
        <div className="flex flex-col gap-[24px]">
          {topDiscountMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              id={menu.id}
              title={menu.title}
              storeName={menu.storeName}
              pickupTime={menu.pickupTime}
              originalPrice={menu.originalPrice}
              salePrice={menu.salePrice}
              discountRate={menu.discountRate}
              stockCount={menu.stockCount}
            />
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </div>
  );
};

export default Home;
