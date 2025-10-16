import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MENUS } from "@/Mock/menudatas";
import MenuCard from "@/components/MenuCard";
import { CATEGORY } from "@/constants/Category";
import type { CategorySlugType } from "@/constants/Category";
import CategoryBadge from "@/components/CategoryBadge";

//category/:slug 페이지 입니다.
//각 선택된 카테고리의 메뉴 리스트를 보여줍니다.

export default function CategoryPage() {
  const { slug } = useParams<{ slug: CategorySlugType }>();
  const [selectedSlug, setSelectedSlug] = useState<CategorySlugType | "all">(
    slug ?? "all",
  );
  const badgeScrollRef = useRef<HTMLDivElement>(null);
  const menuListRef = useRef<HTMLDivElement>(null);
  const badgeRefs = useRef<Record<string, HTMLButtonElement>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const currentBadge = badgeRefs.current[selectedSlug];
    if (currentBadge && badgeScrollRef.current) {
      currentBadge.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selectedSlug]);

  useEffect(() => {
    if (menuListRef.current) {
      menuListRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [selectedSlug]);

  const filteredMenus =
    selectedSlug === "all"
      ? MENUS
      : MENUS.filter((menu) => menu.slug === selectedSlug);

  return (
    <div className="flex flex-col gap-6 mt-4 mb-20 px-4">
      {/* 카테고리 뱃지 목록 */}
      <div
        ref={badgeScrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide select-none overscroll-x-none"
      >
        <CategoryBadge
          ref={(el) => {
            if (el) badgeRefs.current["all"] = el;
          }}
          label="전체"
          active={selectedSlug === "all"}
          onClick={() => setSelectedSlug("all")}
        />
        {CATEGORY.map((category) => (
          <CategoryBadge
            key={category.slug}
            ref={(el) => {
              if (el) badgeRefs.current[category.slug] = el;
            }}
            label={category.label}
            active={selectedSlug === category.slug}
            onClick={() => setSelectedSlug(category.slug)}
          />
        ))}
      </div>

      {/* 메뉴 목록 컨테이너 */}
      {filteredMenus.length > 0 ? (
        // ⭐️ Ref 추가: 메뉴 목록 컨테이너에 menuListRef 연결
        <div ref={menuListRef} className="flex flex-col gap-6 mt-4">
          {filteredMenus.map((menu) => (
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
      ) : (
        <p className="text-gray-500 text-sm mt-10 text-center">
          현재 등록된 상품이 없습니다.
        </p>
      )}
    </div>
  );
}
