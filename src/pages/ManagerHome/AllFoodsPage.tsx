import { MenuHeader } from "@/components/Headers";
import { MenuTodayCard } from "@/components/MenuCard";

export default function AllfoodsPage() {
  return (
    <div>
      <MenuHeader title="오늘의 판매 식품" />
      <div className="text-[18px] font-bold mt-[24px] mb-[16px]">
        총 <span>5</span>개
      </div>
      <div className="flex flex-col gap-4">
        <MenuTodayCard
          name="식품명"
          originalPrice={10000}
          salePrice={8000}
          dueDate={"06.30 (금) 23:00"}
          stockCount={3}
          isShare
        />
        <MenuTodayCard
          name="식품명"
          originalPrice={10000}
          salePrice={8000}
          dueDate={"06.30 (금) 23:00"}
          stockCount={3}
        />
        <MenuTodayCard
          name="식품명"
          originalPrice={10000}
          salePrice={8000}
          dueDate={"06.30 (금) 23:00"}
          stockCount={3}
        />
        <MenuTodayCard
          name="식품명"
          originalPrice={10000}
          salePrice={8000}
          dueDate={"06.30 (금) 23:00"}
          stockCount={3}
        />
        <MenuTodayCard
          name="식품명"
          originalPrice={10000}
          salePrice={8000}
          dueDate={"06.30 (금) 23:00"}
          stockCount={3}
          isSoldOut
        />
      </div>
    </div>
  );
}
