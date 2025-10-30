import StoreImg from "@/assets/images/progile.png";

import { useStoreMenus } from "@/api/nearby/nearby";
import { StoreMenus } from "@/types/nearby";
import NearMenuCard from "@/pages/NearBy/nearByMenu";
import { useNavigate } from "react-router-dom";
import { formatDeadline } from "@/utils/dateFormatter";

type NearbyStorePageProps = {
  id?: number;
};
export default function NearbyStorePage({ id }: NearbyStorePageProps) {
  console.log(id);
  const navigate = useNavigate();
  const { data: storeData } = useStoreMenus(id);
  console.log(storeData);

  console.log(storeData);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[1101] mx-auto w-full max-w-[401px]">
      <div
        className="bg-white rounded-t-2xl overflow-hidden"
        style={{ height: "58vh" }}
      >
        <div
          className="sticky top-0 z-10  px-6 pt-3 pb-4 border-b border-grey-4 "
          onClick={() => navigate(`/store/${id}`)}
        >
          <div className="flex gap-6 items-center">
            <img
              src={storeData?.imageUrl || StoreImg}
              alt="가게 프로필 이미지"
              className="size-20 rounded-full object-cover"
            />
            <div
              className={`flex-1 transition-opacity duration-150 ${
                storeData ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="subtitle-b-18 mb-1">{storeData?.storeName ?? ""}</p>
              <p className="text-grey-2 body-r-14">
                {storeData?.roadAddress ?? ""}
              </p>
            </div>
          </div>
        </div>

        {/* 스크롤 영역: 메뉴 리스트 */}
        <div
          className="px-6 pt-4 overflow-y-auto scrollbar-hide"
          style={{
            height: "calc(60vh - 96px)", // sticky 헤더/그립바 높이만큼 제외(대략)
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {/* 실제 API 데이터 */}
          {storeData?.menus?.length ? (
            <div className="flex flex-col gap-6">
              {storeData.menus.map((item: StoreMenus) => (
                <NearMenuCard
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  storeName={item.storeName}
                  pickupTime={formatDeadline(item.deadline)}
                  originalPrice={item.originalPrice}
                  salePrice={item.discountPrice}
                  discountRate={item.discountRate}
                  stockCount={item.surplusQuantity}
                  imgUrl={item.imageUrl}
                />
              ))}
            </div>
          ) : (
            // 목업 사용 시
            <div className="flex items-center justify-center mt-10">
              <p>등록된 메뉴가 없습니다.</p>
            </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div id="menu-list-sentinel" className="h-10" />
        </div>
      </div>
    </div>
  );
}
