// AddfoodEditPage.tsx
import chevronLeft from "@/assets/icons/floating-checvron-left.svg";
import Button from "@/components/Button";
import { useParams, useNavigate } from "react-router-dom";
import { ADDEDMENUS } from "@/Mock/ownerdatas";
import StartSaleBottomSheet from "./UI/StartSaleBottomSheet";
import { useState } from "react";
import Modal from "@/components/onBoarding/Modal";

export default function AddfoodEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [modal, setModal] = useState(false);

  // id로 해당 메뉴 찾기
  const menu = ADDEDMENUS.find((item) => item.id === Number(id));

  const handleStartSaleButton = () => {
    setIsSheetOpen(true);
  };

  const handleConfirmSale = () => {
    setIsSheetOpen(false);
    setTimeout(() => {
      setModal(true);
    }, 300);
  };

  const closeModal = () => {
    setModal(false);
    navigate(-1);
  };

  // 메뉴를 찾지 못한 경우 처리
  if (!menu) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-[18px] font-bold">식품을 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#FE7549] text-white rounded-lg"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

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
        <div className="w-full h-[240px] bg-gray-400 text-center flex items-center justify-center text-white">
          이미지 자리
        </div>
        <div className="px-6 pb-[100px] flex flex-col gap-[24px]">
          <div className="flex justify-between items-center mt-[24px]">
            <span className="text-[24px] font-bold">{menu.name}</span>
            <div className="w-[50px] h-[24px] bg-[#F3F3F3] rounded-md flex items-center justify-center cursor-pointer text-[14px]">
              수정
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-[14px] font-semibold text-[#A8A8A8]">
              카테고리
            </div>
            <div className="text-[16px] font-semibold">{menu.categoryName}</div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-[14px] font-semibold text-[#A8A8A8]">가격</div>
            <div className="flex gap-6 text-[16px] text-[#7F7F7F] font-semibold">
              <div className="flex justify-center items-center gap-3">
                원가
                <span className="text-[20px] font-bold text-black">
                  {menu.originalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-center items-center gap-3">
                판매가
                <span className="text-[20px] font-bold text-black">
                  {menu.discountPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 바텀시트가 열려있지 않을 때만 버튼 표시 */}
      {!isSheetOpen && (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white border-t border-gray-100 z-50">
          <div className="p-4">
            <Button
              className="w-full text-lg py-6 cursor-pointer"
              labelName="판매 시작하기"
              disabled={false}
              onClick={handleStartSaleButton}
            />
          </div>
        </footer>
      )}

      <StartSaleBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmSale}
      />

      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          ></div>
          <div className="relative z-[101] w-full">
            <Modal
              closeModal={closeModal}
              title="식품이 판매 시작되었어요!"
              subTitle="판매되고 있는 식품은 오늘의 판매 식품에서
확인하실 수 있어요"
            />
          </div>
        </div>
      )}
    </div>
  );
}
