import React, { useMemo } from "react";
import { MENUS } from "@/Mock/menudatas"; // 최대 할인율로 가져올 메뉴 더미 데이터
import { CATEGORY } from "./constants/Category";
import MenuCard from "./components/MenuCard";
import Carousel from "./components/Carousel";

const Home: React.FC = () => {
  // 할인율 높은 메뉴 상위 6개
  const topDiscountMenus = useMemo(() => {
    return [...MENUS]
      .sort((a, b) => b.discountRate - a.discountRate)
      .slice(0, 6);
  }, []);

  return (
    <div>
      <div className="mx-[-24px]">
        <Carousel />
      </div>

      <div className="grid grid-cols-4 gap-x-[16px] gap-y-[16px] mt-[16px]">
        {CATEGORY.map((category) => (
          <div key={category.slug} className="w-[72px]">
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
          {topDiscountMenus.map((menu, idx) => (
            <MenuCard
              key={idx}
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
    </div>
  );
};

export default Home;
