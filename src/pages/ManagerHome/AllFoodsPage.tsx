import { MenuHeader } from "@/components/Headers";
import { MenuTodayCard } from "@/components/MenuCard";
import { useGetOwnerProfile } from "@/api/mypage/mypage";
import { useGetTodayMenus } from "@/api/menu/menu";

export default function AllfoodsPage() {
  const { data: ownerProfile } = useGetOwnerProfile();
  const storeId = ownerProfile?.store.id;
  const { data: todayMenus } = useGetTodayMenus(storeId || 0);

  return (
    <div>
      <MenuHeader title="오늘의 판매 식품" />
      <div className="text-[18px] font-bold mt-[24px] mb-[16px]">
        총 <span>{todayMenus?.todayMenuCount || 0}</span>개
      </div>
      <div className="flex flex-col gap-4">
        {todayMenus?.menus.map((menu) => (
          <MenuTodayCard
            key={menu.id}
            name={menu.name}
            originalPrice={menu.originalPrice}
            salePrice={menu.discountPrice}
            dueDate={menu.deadline}
            stockCount={menu.surplusQuantity}
            isShare={menu.isShared}
            isSoldOut={menu.isSoldOut}
            imageUrl={menu.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
