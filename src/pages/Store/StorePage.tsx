import { useParams } from "react-router-dom";
import { MenuHeader } from "@/components/Headers";
import MenuCard from "@/components/MenuCard";
import { useGetStoreMenus } from "@/api/menu/menu";
import basicImage from "@/assets/images/basic.svg";

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { data: storeData, isLoading, isError } = useGetStoreMenus(Number(id));

  if (isLoading) return <p>로딩 중...</p>;
  if (isError || !storeData) return <p>매장을 찾을 수 없습니다.</p>;

  const { storeName, roadAddress, detailAddress, imageUrl, menus } = storeData;
  const fullAddress = `${roadAddress} ${detailAddress}`;

  return (
    <div>
      <MenuHeader title="매장별 식품" />
      <div className="flex flex-col gap-[24px]">
        <div className="flex gap-[16px] items-center border-b border-gray-200 pb-[16px] mx-[-24px] px-[24px] py-[16px]">
          <div className="w-[80px] h-[80px] bg-gray-300 rounded-full overflow-hidden">
            <img
              src={imageUrl || basicImage}
              alt={storeName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[20px] font-bold">{storeName}</span>
            <span className="text-[14px] text-gray-600">{fullAddress}</span>
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          {menus.length > 0 ? (
            menus.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                title={item.name}
                storeName={storeName}
                pickupTime={item.deadline || ""}
                originalPrice={item.originalPrice}
                salePrice={item.discountPrice}
                discountRate={item.discountRate}
                stockCount={item.surplusQuantity}
                imageUrl={item.imageUrl}
                isShared={item.shared}
              />
            ))
          ) : (
            <p>등록된 메뉴가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
