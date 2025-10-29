import StoreImg from "@/assets/images/logo.png";

import { useStoreMenus } from "@/api/nearby/nearby";
import { StoreMenus } from "@/types/nearby";
import NearMenuCard from "@/pages/NearBy/nearByMenu";
import { useNavigate } from "react-router-dom";

const MENUS = [
  // 🥖 breads
  {
    id: 1,
    title: "식빵",
    storeName: "파리바게뜨",
    storeId: 1,
    pickupTime: "10:00 ~ 12:00",
    originalPrice: 9000,
    salePrice: 7000,
    discountRate: 22,
    stockCount: 5,
    slug: "breads",
    location: "서울특별시 강서구 화곡로 142",
    imgUrl: "",
  },
  {
    id: 2,
    title: "크루아상 3개입",
    storeName: "뚜쥬루과자점",
    storeId: 2,
    pickupTime: "14:00 ~ 16:00",
    originalPrice: 7500,
    salePrice: 5000,
    discountRate: 33,
    stockCount: 8,
    slug: "breads",
    location: "서울특별시 강서구 등촌로 153",
    imgUrl: "",
  },
  {
    id: 3,
    title: "앙버터빵",
    storeName: "브레드샵",
    storeId: 3,
    pickupTime: "11:00 ~ 13:00",
    originalPrice: 4500,
    salePrice: 3000,
    discountRate: 33,
    stockCount: 3,
    slug: "breads",
    location: "서울특별시 강서구 염창로 215",
    imgUrl: "",
  },

  // 🍱 packedmeal
  {
    id: 4,
    title: "닭가슴살 도시락",
    storeName: "헬린푸드",
    storeId: 4,
    pickupTime: "12:00 ~ 14:00",
    originalPrice: 8000,
    salePrice: 5600,
    discountRate: 30,
    stockCount: 10,
    slug: "packedmeal",
    location: "서울특별시 강서구 마곡중앙로 161",
    imgUrl: "",
  },
  {
    id: 5,
    title: "연어덮밥",
    storeName: "오도시락",
    storeId: 5,
    pickupTime: "11:30 ~ 13:00",
    originalPrice: 9500,
    salePrice: 7000,
    discountRate: 26,
    stockCount: 6,
    slug: "packedmeal",
    location: "서울특별시 강서구 공항대로 247",
    imgUrl: "",
  },
  {
    id: 6,
    title: "불고기 정식",
    storeName: "한솥도시락",
    storeId: 6,
    pickupTime: "17:00 ~ 19:00",
    originalPrice: 8500,
    salePrice: 6500,
    discountRate: 24,
    stockCount: 12,
    slug: "packedmeal",
    location: "서울특별시 강서구 강서로 54길 21",
    imgUrl: "",
  },

  // 🧂 ingredients
  {
    id: 7,
    title: "유기농 달걀 10구",
    storeName: "그린마켓",
    storeId: 7,
    pickupTime: "09:00 ~ 11:00",
    originalPrice: 6900,
    salePrice: 4900,
    discountRate: 29,
    stockCount: 20,
    slug: "ingredients",
    location: "서울특별시 강서구 우장산로 86",
    imgUrl: "",
  },
  {
    id: 8,
    title: "국산 두부 3팩 세트",
    storeName: "채식상점",
    storeId: 8,
    pickupTime: "10:00 ~ 12:00",
    originalPrice: 4500,
    salePrice: 3000,
    discountRate: 33,
    stockCount: 9,
    slug: "ingredients",
    location: "서울특별시 강서구 등촌로 101",
    imgUrl: "",
  },
];

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
            <div className="flex-1">
              <p className="subtitle-b-18 mb-1">
                {storeData?.storeName ?? "가게 정보"}
              </p>
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
                  pickupTime="10:00~23:00"
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
            <div className="flex flex-col gap-6">
              {MENUS.map((m) => (
                <NearMenuCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  storeName={m.storeName}
                  pickupTime={m.pickupTime}
                  originalPrice={m.originalPrice}
                  salePrice={m.salePrice}
                  discountRate={m.discountRate}
                  stockCount={m.stockCount}
                  imgUrl={m.imgUrl}
                />
              ))}
              {/* <div className="flex items-center justify-center mt-10">
                <p>아직 등록된 메뉴가 없습니다.</p>
              </div> */}
            </div>
          )}

          {/* 무한스크롤 트리거 */}
          <div id="menu-list-sentinel" className="h-10" />
        </div>
      </div>
    </div>
  );
}
