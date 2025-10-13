import { useRef, useState, useEffect, useCallback } from "react";
import Minus from "@/assets/minus.svg";
import Plus from "@/assets/plus.svg";

interface OrderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  stockCount: number;
  storeName: string;
  pickupTime: string;
  salePrice: number;
}

export default function OrderBottomSheet({
  isOpen,
  onClose,
  title,
  stockCount,
  storeName,
  pickupTime,
  salePrice,
}: OrderBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const [translateY, setTranslateY] = useState(292);
  const [isDragging, setIsDragging] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(1);

  const ANIMATION_DURATION = 300;
  const MAX_HEIGHT = 292;
  const MIN_HEIGHT = 0;
  const CLOSE_THRESHOLD = 100;

  const totalPrice = salePrice * buyQuantity;

  // --- 스크롤 막기 로직 추가 ---
  useEffect(() => {
    if (isOpen) {
      // 바텀 시트가 열릴 때 body의 스크롤을 막습니다.
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none"; // 터치 스크롤 방지
    } else {
      // 바텀 시트가 닫힐 때 body의 스크롤을 다시 허용합니다.
      // 이 로직은 부모 컴포넌트에서 isOpen이 false로 변경될 때 실행됩니다.
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    // 컴포넌트가 언마운트되거나 isOpen이 false가 될 때 정리(cleanup) 함수
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);
  // -------------------------

  const animateClose = useCallback(() => {
    setTranslateY(MAX_HEIGHT);

    // 애니메이션 시간 후에 실제 onClose 콜백 호출
    setTimeout(() => {
      onClose();
    }, ANIMATION_DURATION);
  }, [onClose]);

  useEffect(() => {
    if (isDragging) return;

    if (isOpen) {
      setTranslateY(MIN_HEIGHT);
    } else {
      animateClose();
    }
  }, [isOpen, isDragging, animateClose]);

  // 드래그 로직은 변경 없음
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isOpen) return;
    setIsDragging(true);
    startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isOpen) return;
    currentY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    const diff = currentY.current - startY.current;
    if (diff > 0) {
      setTranslateY(Math.min(diff, MAX_HEIGHT));
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY > CLOSE_THRESHOLD) {
      animateClose();
    } else {
      setTranslateY(MIN_HEIGHT);
    }
  };

  // transition 적용 로직은 변경 없음
  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.style.transition = isDragging
        ? "none"
        : `transform ${ANIMATION_DURATION}ms ease-out`;
      sheetRef.current.style.transform = `translateY(${translateY}px)`;
    }
  }, [translateY, isDragging]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && isOpen) {
      animateClose();
    }
  };

  const isFullyClosed = !isOpen && translateY === MAX_HEIGHT;
  if (isFullyClosed) {
    return null;
  }

  const overlayOpacity = 1 - translateY / MAX_HEIGHT;

  return (
    // 1. 다크 오버레이 역할
    <div
      className={`
        fixed inset-0 bg-black/50 z-20 
        transition-opacity duration-300
      `}
      onClick={handleOverlayClick}
      style={{
        pointerEvents: isFullyClosed ? "none" : "auto",
        opacity: overlayOpacity,
      }}
    >
      {/* 바텀 시트 본체 */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white rounded-t-2xl z-30 mb-20"
        style={{
          height: `${MAX_HEIGHT}px`,
          touchAction: "none",
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[40px] h-[4px] bg-gray-200 rounded-3xl mx-auto mt-2 cursor-grab"></div>

        <div className="px-6 pt-6 flex flex-col gap-6">
          <div className="flex gap-4">
            <div className="w-[72px] h-[72px] bg-gray-500 rounded-2xl flex justify-center items-center">
              이미지
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold">{title}</span>
                <span className="text-[14px] font-semibold">{storeName}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-[#7F7F7F]">
                픽업 가능 시간 <span>{pickupTime}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full bg-[#F3F3F3] rounded-2xl p-4 gap-2">
            <div className="text-[16px] font-semibold">구매 수량</div>
            <div className="flex justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setBuyQuantity((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={buyQuantity <= 1 || stockCount === 0}
                  className="disabled:opacity-50 cursor-pointer"
                >
                  <img src={Minus} alt="minus" />
                </button>
                <span>{buyQuantity}</span>
                <button
                  onClick={() =>
                    setBuyQuantity((prev) => Math.min(prev + 1, stockCount))
                  }
                  disabled={buyQuantity >= stockCount}
                  className="disabled:opacity-50 cursor-pointer"
                >
                  <img src={Plus} alt="plus" />
                </button>
              </div>
              <div className="text-[16px] font-[400]">
                <span>{salePrice.toLocaleString()}</span>원
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-[16px] font-semibold">총 상품 금액</div>
            <div className="flex gap-4 items-center justify-end">
              <div className="text-[14px] text-[#7F7F7F]">
                총 수량<span>{buyQuantity}</span>개
              </div>
              <div className="text-[18px] font-bold">
                <span>{totalPrice.toLocaleString()}</span>원
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
