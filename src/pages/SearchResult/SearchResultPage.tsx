import { useSearchParams } from "react-router-dom";
import { MENUS } from "@/Mock/menudatas";
import { useMemo } from "react";
import MenuCard from "@/components/MenuCard"; // ✅ 홈에서 쓰던 카드 컴포넌트 import

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  // 검색어 기반 필터링
  const filteredMenus = useMemo(() => {
    if (!query) return [];
    return MENUS.filter(
      (menu) =>
        menu.title.toLowerCase().includes(query) ||
        menu.storeName.toLowerCase().includes(query),
    );
  }, [query]);

  return (
    <div className="pt-4 pb-20">
      <h2 className="text-lg font-semibold mb-3">
        “{query}” 검색 결과 ({filteredMenus.length}개)
      </h2>

      {filteredMenus.length > 0 ? (
        <div className="flex flex-col gap-[24px]">
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
        <p className="text-gray-500 mt-10 text-center">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
