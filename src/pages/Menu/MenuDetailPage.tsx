import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StockBadge from "@/components/StockBadge";
import StoreInfoCard from "@/components/StoreInfoCard";
import MenuCard from "@/components/MenuCard";
import Button from "@/components/Button";
import chevronLeft from "@/assets/icons/floating-checvron-left.svg";
import OrderBottomSheet from "./UI/OrderBottomSheet";
import { useGetMenuDetail } from "@/api/menu/menu";
import { formatDeadline } from "@/utils/dateFormatter";

export default function MenuDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState<number>(1);

  // API를 통해 메뉴 상세 정보 조회
  const { data: menuDetail, isLoading } = useGetMenuDetail(Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  // 메뉴를 찾을 수 없을 때
  if (!menuDetail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>메뉴를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const menu = menuDetail;
  const store = menuDetail.store;

  const handleReservationClick = () => {
    if (!isSheetOpen) {
      setIsSheetOpen(true);
      return;
    }

    //토큰 체크 -> 테스트입니다.
    // const accessToken = getAccessToken();

    // if (!accessToken) {
    // alert("로그인 후 이용해주세요");
    //navigate("/login");
    // return;
    // }

    // 예약 페이지로 이동하면서 데이터 전달
    navigate(`/menu/${id}/reserve`, {
      state: {
        quantity: buyQuantity,
        title: menu.name,
        salePrice: menu.discountPrice,
        storeName: store.name,
        pickupTime: menu.deadline,
      },
    });
  };

  // 카테고리 레이블 (API에서 category는 문자열로 직접 전달됨)
  const categoryLabel = menu.category;

  // 가게의 다른 메뉴들 (API에서 otherMenus로 제공됨)
  const otherMenus = menu.otherMenus || [];

  return (
    <div className="relative w-full max-w-[401px] mx-auto">
      <div
        className="absolute top-6 left-3 z-20"
        onClick={() => window.history.back()}
      >
        <img
          src={chevronLeft}
          alt="뒤로가기"
          className="cursor-pointer fixed"
        />
      </div>

      <div>
        <div className="w-full h-[240px] bg-gray-400 text-center">
          이미지 자리
        </div>

        <div className="px-6 pb-[100px]">
          <div className="flex justify-between items-center mt-[24px]">
            <span className="text-[24px] font-bold">{menu.name}</span>
            <StockBadge count={menu.surplusQuantity} />
          </div>

          <div className="flex justify-between items-center mt-[16px] my-[24px]">
            <div className="flex flex-col gap-[8px] text-[14px] text-[#7F7F7F] font-semibold">
              <p>
                카테고리{" "}
                <span className="font-[400] ml-[8px]">{categoryLabel}</span>
              </p>
              <p>
                픽업 가능시간{" "}
                <span className="font-[400] ml-[8px]">
                  {formatDeadline(menu.deadline)}
                </span>
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-end text-[14px] text-[#A8A8A8] line-through">
                <span>{menu.originalPrice.toLocaleString()}</span>원
              </div>
              <div className="flex gap-[10px] items-center justify-end">
                <div className="text-[16px] font-semibold text-[#F30000]">
                  <span>{menu.discountRate}</span>%
                </div>
                <div className="text-[20px] font-bold">
                  <span>{menu.discountPrice.toLocaleString()}</span>원
                </div>
              </div>
            </div>
          </div>

          <StoreInfoCard
            id={store.id}
            name={store.name}
            address={store.roadAddress}
          />

          {otherMenus.length > 0 && (
            <div className="mt-[32px] flex flex-col">
              <div className="text-[20px] font-bold mb-[16px]">
                가게의 다른 식품
              </div>
              <div className="flex flex-col gap-[24px] ">
                {otherMenus.map((item) => (
                  <MenuCard
                    key={item.id}
                    id={item.id}
                    title={item.name}
                    storeName={item.storeName}
                    pickupTime={item.deadline}
                    originalPrice={item.originalPrice}
                    salePrice={item.discountPrice}
                    discountRate={item.discountRate}
                    stockCount={item.surplusQuantity}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white border-t border-gray-100 z-50">
          <div className="p-4">
            <Button
              className="w-full text-lg py-6 cursor-pointer"
              labelName="예약하기"
              disabled={menu.surplusQuantity === 0}
              onClick={handleReservationClick}
            />
          </div>
        </footer>

        {/* 예약 바텀 시트*/}
        <OrderBottomSheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          title={menu.name}
          storeName={store.name}
          pickupTime={menu.deadline}
          salePrice={menu.discountPrice}
          stockCount={menu.surplusQuantity}
          buyQuantity={buyQuantity}
          setBuyQuantity={setBuyQuantity}
        />
      </div>
    </div>
  );
}
