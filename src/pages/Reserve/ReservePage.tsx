import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuHeader } from "@/components/Headers";
import chevronDownImg from "@/assets/icons/chevron-down.svg";
import Button from "@/components/Button";
import DialPicker from "@/components/DialPicker";
import { formatDeadline } from "@/utils/dateFormatter";

interface ReserveState {
  quantity: number;
  title?: string;
  salePrice?: number;
  storeName?: string;
  pickupTime?: string;
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

const generateTimeItems = (start: number, end: number, step: number = 1) => {
  const items = [];
  for (let i = start; i <= end; i += step) {
    items.push({
      value: i,
      label: formatToTwoDigits(i),
    });
  }
  return items;
};

const MINUTE_STEP = 10;
const minuteItems = generateTimeItems(0, 59, MINUTE_STEP);

export default function ReservePage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ReserveState | null;

  const pickupTimeRange = state?.pickupTime?.match(
    /(\d{2}):\d{2}\s*~\s*(\d{2}):\d{2}/,
  );

  // 파싱 실패시 기본값
  const startHour = pickupTimeRange ? parseInt(pickupTimeRange[1], 10) : 9;
  const endHour = pickupTimeRange ? parseInt(pickupTimeRange[2], 10) : 18;

  const hourItems = generateTimeItems(startHour, endHour);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">(
    dateItems[0].value as "today" | "tomorrow",
  );
  const [selectedHour, setSelectedHour] = useState<number>(
    hourItems[0].value as number,
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(
    minuteItems[0].value as number,
  );

  useEffect(() => {
    if (!state || !state.quantity) {
      navigate(`/menu/${id}`, { replace: true });
    }
  }, [state, id, navigate]);

  if (!state) {
    return null;
  }

  const { quantity, title, salePrice, storeName, pickupTime } = state;
  const totalPrice = (salePrice || 0) * quantity;

  const selectedDateLabel =
    dateItems.find((item) => item.value === selectedDate)?.label || "";
  const formattedHour = formatToTwoDigits(selectedHour);
  const formattedMinute = formatToTwoDigits(selectedMinute);

  return (
    <div className="relative min-h-screen">
      <MenuHeader title="예약하기" />

      {/* 메뉴 정보 */}
      <div className="flex gap-[16px] bg-[#F3F3F3] p-[24px] mx-[-24px]">
        <div className="w-[72px] h-[72px] bg-gray-400 rounded-2xl"></div>
        <div className="flex flex-col justify-center">
          <div className="flex gap-4 items-center">
            <span className="text-[16px] font-bold">{title}</span>
            <span className="text-[14px] font-semibold text-[#7f7f7f]">
              {storeName}
            </span>
          </div>
          <div className="text-[14px] font-normal text-[#7f7f7f]">
            <div>
              수량 <span> {quantity}</span>
            </div>
            <div>
              픽업 가능 시간 <span>{formatDeadline(pickupTime || "")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-[24px] space-y-8">
        <div
          className="flex justify-between items-center pt-[24px]"
          onClick={() => setIsPickerOpen((prev) => !prev)}
        >
          <div className="text-[16px] font-normal text-[#7f7f7f]">
            픽업 날짜 및 시간
          </div>
          <div className="flex items-center text-[18px] font-bold cursor-pointer">
            <span
              className={isPickerOpen ? "text-[#FE7549]" : "text-black"}
            >{`${selectedDateLabel} ${formattedHour}:${formattedMinute}`}</span>

            <img
              src={chevronDownImg}
              alt="chevron down"
              className={`inline ml-2 w-4 h-4 transition-transform ${isPickerOpen ? "rotate-180" : "rotate-0"}`}
            />
          </div>
        </div>

        {/* 다이얼 컴포넌트 */}
        {isPickerOpen && (
          <div className="w-[260px] mx-auto bg-white py-4  mb-4">
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
        <div className="flex justify-between items-center pt-4">
          <div className="text-[16px] font-normal text-[#7f7f7f]">
            결제 금액
          </div>
          <span className="text-[18px] font-bold">
            {totalPrice.toLocaleString()} 원
          </span>
        </div>
      </div>
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white border-t border-gray-100 z-50">
        <div className="p-4">
          <Button
            className="w-full text-lg py-6 cursor-pointer"
            labelName="결제하기"
            disabled={false}
          />
        </div>
      </footer>
    </div>
  );
}
