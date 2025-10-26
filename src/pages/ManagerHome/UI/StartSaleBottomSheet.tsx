// StartSaleBottomSheet.tsx
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";
import chevronDownImg from "@/assets/icons/chevron-down.svg";
import Minus from "@/assets/icons/minus.svg";
import Plus from "@/assets/icons/plus.svg";
import DialPicker from "@/components/DialPicker";
import Button from "@/components/Button";

interface OrderBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
  onConfirm?: () => void;
}

const formatToTwoDigits = (num: number) => String(num).padStart(2, "0");

const getDayOfWeek = (date: Date) => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const todayDay = getDayOfWeek(today);
const tomorrowDay = getDayOfWeek(tomorrow);

const dateItems = [
  { value: "today", label: `오늘(${todayDay})` },
  { value: "tomorrow", label: `내일(${tomorrowDay})` },
];

// 0시부터 23시까지
const hourItems = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: formatToTwoDigits(i),
}));

// 0분부터 59분까지
const minuteItems = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: formatToTwoDigits(i),
}));

export default function StartSaleBottomSheet({
  isOpen,
  onClose,
  quantity,
  setQuantity,
  onConfirm,
}: OrderBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startTranslateY = useRef(0);
  const [translateY, setTranslateY] = useState(580);
  const [isDragging, setIsDragging] = useState(false);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isFreeForCard, setIsFreeForCard] = useState(false);

  // 현재 시간으로 초기화
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">(
    "today",
  );
  const [selectedHour, setSelectedHour] = useState<number>(now.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(
    now.getMinutes(),
  );

  const ANIMATION_DURATION = 300;
  const MAX_HEIGHT = isPickerOpen ? 540 : 380;
  const MIN_HEIGHT = 0;
  const CLOSE_THRESHOLD = 100;

  // 선택된 날짜 라벨
  const selectedDateLabel =
    dateItems.find((item) => item.value === selectedDate)?.label ||
    `오늘(${todayDay})`;
  const formattedHour = formatToTwoDigits(selectedHour);
  const formattedMinute = formatToTwoDigits(selectedMinute);

  // 스크롤 막기 로직
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTranslateY(MIN_HEIGHT);
    } else {
      setTranslateY(MAX_HEIGHT);
    }
  }, [isOpen, MAX_HEIGHT]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isOpen) return;
    setIsDragging(true);
    startY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    startTranslateY.current = translateY;
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !isOpen) return;
    const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const diff = currentY - startY.current;
    const newTranslateY = startTranslateY.current + diff;

    setTranslateY(Math.max(MIN_HEIGHT, Math.min(newTranslateY, MAX_HEIGHT)));
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (translateY > CLOSE_THRESHOLD) {
      setTranslateY(MAX_HEIGHT);
      setTimeout(() => {
        onClose();
      }, ANIMATION_DURATION);
    } else {
      setTranslateY(MIN_HEIGHT);
    }
  };

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
      setTranslateY(MAX_HEIGHT);
      setTimeout(() => {
        onClose();
      }, ANIMATION_DURATION);
    }
  };

  const isFullyClosed = !isOpen && translateY === MAX_HEIGHT;
  if (isFullyClosed) {
    return null;
  }

  const overlayOpacity = 1 - translateY / MAX_HEIGHT;

  return (
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
      <style>{`
        input[type="checkbox"] {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #D1D5DB;
          border-radius: 4px;
          background-color: white;
          cursor: pointer;
          position: relative;
        }
        
        input[type="checkbox"]:checked {
          background-color: white;
          border-color: #FE7549;
        }
        
        input[type="checkbox"]:checked::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #FE7549;
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white rounded-t-2xl z-30"
        style={{
          height: `${MAX_HEIGHT}px`,
          touchAction: "none",
          transition: `height ${ANIMATION_DURATION}ms ease-out`,
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

        <div className="px-6 pt-6 flex flex-col gap-6 pb-4">
          <div className="flex justify-between">
            <div className="text-[16px] font-semibold">수량</div>
            <div className="flex items-center justify-center gap-4 bg-[#F3F3F3] w-[106px] rounded-lg py-2">
              <button
                onClick={() => setQuantity?.((prev) => Math.max(prev - 1, 1))}
                disabled={quantity <= 1}
                className="disabled:opacity-50 cursor-pointer"
              >
                <img src={Minus} alt="minus" />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity?.((prev) => prev + 1)}
                className="disabled:opacity-50 cursor-pointer"
              >
                <img src={Plus} alt="plus" />
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <div className="text-[16px] font-semibold">마감기한</div>
              <div
                className="flex items-center text-[16px] font-semibold cursor-pointer"
                onClick={() => setIsPickerOpen(!isPickerOpen)}
              >
                <span
                  className={isPickerOpen ? "text-[#FE7549]" : "text-black"}
                >
                  {`${selectedDateLabel} ${formattedHour}:${formattedMinute}`}
                </span>

                <img
                  src={chevronDownImg}
                  alt="chevron down"
                  className={`inline ml-2 w-4 h-4 transition-transform ${isPickerOpen ? "rotate-180" : "rotate-0"}`}
                />
              </div>
            </div>

            {/* 다이얼 컴포넌트 - 조건부 렌더링 */}
            {isPickerOpen && (
              <div className="w-[260px] mx-auto bg-white py-4 mt-4">
                <div className="flex justify-center">
                  <DialPicker
                    items={dateItems}
                    selectedValue={selectedDate}
                    onValueChange={(val) =>
                      setSelectedDate(val as "today" | "tomorrow")
                    }
                  />
                  <DialPicker
                    items={hourItems}
                    selectedValue={selectedHour}
                    onValueChange={(val) => setSelectedHour(val as number)}
                    unit="시"
                  />
                  <DialPicker
                    items={minuteItems}
                    selectedValue={selectedMinute}
                    onValueChange={(val) => setSelectedMinute(val as number)}
                    unit="분"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-[16px] font-bold">혜택 제공 여부</div>
            <div className="flex gap-2 items-center bg-[#F3F3F3] py-2 px-4 rounded-lg">
              <input
                type="checkbox"
                checked={isFreeForCard}
                onChange={(e) => setIsFreeForCard(e.target.checked)}
              />
              <span className="text-[16px] font-semibold">
                급식 카드 소지자 무료로 판매
              </span>
            </div>
          </div>
          <div className="text-[12px] font-normal text-[#7F7F7F]">
            무료로 판매한 식품은 상위에 노출되며, 5개 이상 무료 제공 시 착한가게
            배지가 부여됩니다. 작은 나눔이 결식아동에게 큰 힘이 됩니다.
          </div>

          {/* 판매 시작하기 버튼 */}
          <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white border-t border-gray-100 z-50">
            <div className="p-4">
              <Button
                className="w-full text-lg py-6 cursor-pointer"
                labelName="판매 시작하기"
                disabled={false}
                onClick={onConfirm}
              />
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
