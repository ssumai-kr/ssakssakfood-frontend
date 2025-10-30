import { useSearchParams } from "react-router-dom";
import MenuCard from "@/components/MenuCard";
import { useSearchMenus, useSearchMenusGuest } from "@/api/menu/menu";
import { isLoggedIn } from "@/utils/getUserInfo";
import { useGetMyPrimaryLocation } from "@/api/location/location";
import useGeolocation from "@/hooks/useGeolocation";

export default function SearchResultPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const loggedIn = isLoggedIn();
  const { data: primaryLocation } = useGetMyPrimaryLocation(loggedIn);
  const { latitude, longitude } = useGeolocation();

  // 비회원이거나 대표 주소가 없는 경우 guest API 사용
  const shouldUseGuestApi = !loggedIn || !primaryLocation;

  // 회원용 API
  const { data: memberResults, isLoading: memberLoading } = useSearchMenus(
    { keyword: query },
    !shouldUseGuestApi,
  );

  // 게스트용 API
  const { data: guestResults, isLoading: guestLoading } = useSearchMenusGuest(
    latitude,
    longitude,
    { keyword: query },
    shouldUseGuestApi,
  );

  const searchResults = shouldUseGuestApi ? guestResults : memberResults;
  const isLoading = shouldUseGuestApi ? guestLoading : memberLoading;
  const filteredMenus = searchResults || [];

  return (
    <div className="pt-4 pb-20">
      <h2 className="text-lg font-semibold mb-3">
        &quot;{query}&quot; 검색 결과 ({filteredMenus.length}개)
      </h2>

      {isLoading ? (
        <p className="text-gray-500 mt-10 text-center">로딩 중...</p>
      ) : filteredMenus.length > 0 ? (
        <div className="flex flex-col gap-[24px]">
          {filteredMenus.map((menu) => (
            <MenuCard
              key={menu.id}
              id={menu.id}
              title={menu.name}
              storeName={menu.storeName}
              pickupTime={menu.deadline}
              originalPrice={menu.originalPrice}
              salePrice={menu.discountPrice}
              discountRate={menu.discountRate}
              stockCount={menu.surplusQuantity}
              imageUrl={menu.imageUrl}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-10 text-center">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
