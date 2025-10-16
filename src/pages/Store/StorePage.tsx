import { useParams } from "react-router-dom";
import { MenuHeader } from "@/components/Headers";
import { MENUS } from "@/Mock/menudatas";
import { STORES } from "@/Mock/storedatas";
import MenuCard from "@/components/MenuCard";

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const store = STORES.find((s) => s.id === Number(id));

  if (!store) return <p>매장을 찾을 수 없습니다.</p>;

  const storeMenus = MENUS.filter((m) => m.storeId === store.id);

  return (
    <div>
      <MenuHeader title="매장별 식품" />
      <div className="flex flex-col gap-[24px]">
        <div className="flex gap-[16px] items-center border-b border-gray-200 pb-[16px] mx-[-24px] px-[24px] py-[16px]">
          <div className="w-[80px] h-[80px] bg-gray-300 rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-[20px] font-bold">{store.name}</span>
            <span className="text-[14px] text-gray-600">{store.address}</span>
          </div>
        </div>

        <div className="flex flex-col gap-[24px]">
          {storeMenus.length > 0 ? (
            storeMenus.map((item) => (
              <MenuCard
                key={item.id}
                id={item.id}
                title={item.title}
                storeName={item.storeName}
                pickupTime={item.pickupTime}
                originalPrice={item.originalPrice}
                salePrice={item.salePrice}
                discountRate={item.discountRate}
                stockCount={item.stockCount}
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
