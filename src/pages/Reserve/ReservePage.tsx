import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuHeader } from "@/components/Headers";
import chevronDownImg from "@/assets/icons/chevron-down.svg";
import Button from "@/components/Button";
import DialPicker from "@/components/DialPicker";
import { formatDeadline } from "@/utils/dateFormatter";
import { useCreateReservation } from "@/api/reservation/reservation";
import type { PaymentRequest, PaymentResponse } from "@/types/portone";
import basicImage from "@/assets/images/basic.svg";
import { AxiosError } from "axios";

interface ReserveState {
  quantity: number;
  title?: string;
  salePrice?: number;
  storeName?: string;
  pickupTime?: string;
  imageUrl?: string;
  useMealCard?: boolean;
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
  const createReservationMutation = useCreateReservation();

  // pickupTime 파싱 및 기본값 설정
  // ISO 8601 형식 (예: 2025-10-31T23:50:00)에서 시간 추출
  let startHour = 9;
  let endHour = 18;

  if (state?.pickupTime) {
    // ISO 형식인 경우 Date 객체로 파싱
    if (state.pickupTime.includes("T")) {
      const pickupDate = new Date(state.pickupTime);
      endHour = pickupDate.getHours();
      // 시작 시간은 기본값 9시 사용 (또는 다른 로직 필요 시 수정)
      startHour = 9;
    } else {
      // 기존 "HH:MM ~ HH:MM" 형식
      const pickupTimeRange = state.pickupTime.match(
        /(\d{2}):\d{2}\s*~\s*(\d{2}):\d{2}/,
      );
      if (pickupTimeRange) {
        startHour = parseInt(pickupTimeRange[1], 10);
        endHour = parseInt(pickupTimeRange[2], 10);
      }
    }
  }

  console.log("==== 픽업 가능 시간 정보 ====");
  console.log("원본 pickupTime:", state?.pickupTime);
  console.log("파싱된 시작 시간:", startHour);
  console.log("파싱된 종료 시간:", endHour);

  // 모든 Hook 호출은 early return 전에 위치
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">(
    dateItems[0].value as "today" | "tomorrow",
  );

  // 모든 시간 선택 가능하도록 설정
  const hourItems = generateTimeItems(0, 23);

  const [selectedHour, setSelectedHour] = useState<number>(startHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  // state가 없으면 메뉴 상세 페이지로 리다이렉트
  useEffect(() => {
    if (!state || !state.quantity) {
      navigate(`/menu/${id}`, { replace: true });
    }
  }, [state, id, navigate]);

  // state가 없으면 렌더링하지 않음
  if (!state || !state.quantity) {
    return null;
  }

  if (!state) {
    return null;
  }

  const {
    quantity,
    title,
    salePrice,
    storeName,
    pickupTime,
    imageUrl,
    useMealCard,
  } = state;
  const totalPrice = useMealCard ? 0 : (salePrice || 0) * quantity;

  const selectedDateLabel =
    dateItems.find((item) => item.value === selectedDate)?.label || "";
  const formattedHour = formatToTwoDigits(selectedHour);
  const formattedMinute = formatToTwoDigits(selectedMinute);

  const getPickupDateTime = (): string => {
    const baseDate = selectedDate === "today" ? today : tomorrow;
    const pickupDate = new Date(baseDate);
    pickupDate.setHours(selectedHour, selectedMinute, 0, 0);

    const year = pickupDate.getFullYear();
    const month = formatToTwoDigits(pickupDate.getMonth() + 1);
    const day = formatToTwoDigits(pickupDate.getDate());
    const hours = formatToTwoDigits(pickupDate.getHours());
    const minutes = formatToTwoDigits(pickupDate.getMinutes());
    const seconds = formatToTwoDigits(pickupDate.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 포트원 결제 처리
  const handlePayment = (
    reservationId: number,
    amount: number,
    memberEmail: string,
  ) => {
    const IMP = window.IMP;
    if (!IMP) {
      alert("결제 모듈을 불러오는데 실패했습니다.");
      return;
    }

    IMP.init("imp35572833");

    const paymentData: PaymentRequest = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `reservation_${reservationId}`,
      name: "싹싹푸드 예약 결제",
      amount: amount,
      buyer_email: memberEmail,
      buyer_name: "고객",
      notice_url:
        "http://saksakfood-api-gateway-s-da7e9-110329723-31b4b99c070a.kr.lb.naverncp.com/api/payments/webhook",
    };

    console.log("==== 결제 요청 데이터 ====");
    console.log("buyer_email:", memberEmail);

    IMP.request_pay(paymentData, (response: PaymentResponse) => {
      console.log("==== PortOne 결제 응답 ====");
      console.log(response);

      if (response.success) {
        alert("결제가 완료되었습니다!");
        navigate("/");
      } else {
        alert(`결제 실패: ${response.error_msg}`);
      }
    });
  };

  const handleReserveAndPay = () => {
    if (!id) {
      alert("메뉴 ID가 없습니다.");
      return;
    }

    const userDataString = localStorage.getItem("user");
    console.log("==== 로그인 상태 확인 ====");
    console.log("localStorage user:", userDataString);

    if (!userDataString) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    // 오늘 선택 시 유효성 검사
    if (selectedDate === "today") {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // 현재 시간보다 이전인지 확인
      if (
        selectedHour < currentHour ||
        (selectedHour === currentHour && selectedMinute <= currentMinute)
      ) {
        alert("현재보다 이전 시간은 선택하실 수 없습니다!");
        return;
      }

      // 픽업 가능 시간 범위 체크
      if (selectedHour < startHour || selectedHour > endHour) {
        alert("픽업 가능시간을 넘길 수 없습니다!");
        return;
      }
    } else {
      // 내일 선택 시 픽업 가능 시간 범위 체크
      if (selectedHour < startHour || selectedHour > endHour) {
        alert("픽업 가능시간을 넘길 수 없습니다!");
        return;
      }
    }

    const pickupDateTime = getPickupDateTime();

    const requestData = {
      menuId: Number(id),
      body: {
        foodQuantity: quantity,
        pickupTime: pickupDateTime,
        isShared: useMealCard || false,
      },
    };

    console.log("==== 예약 생성 요청 데이터 ====");
    console.log("menuId:", requestData.menuId);
    console.log("foodQuantity:", requestData.body.foodQuantity);
    console.log("pickupTime:", requestData.body.pickupTime);
    console.log("isShared:", requestData.body.isShared);
    console.log("전체 요청 body:", JSON.stringify(requestData.body, null, 2));

    // 예약 생성 API
    createReservationMutation.mutate(requestData, {
      onSuccess: (reservationData) => {
        console.log("예약 생성 성공:", reservationData);

        // 급식 카드 사용 시 결제 건너뛰고 바로 완료 처리
        if (useMealCard) {
          alert("예약이 완료되었습니다!");
          navigate("/");
        } else {
          // 일반 결제 진행
          handlePayment(
            reservationData.reservationId,
            reservationData.totalAmount,
            reservationData.memberEmail,
          );
        }
      },
      onError: (error: unknown) => {
        console.error("==== 예약 생성 실패 ====");
        console.error("전체 에러:", error);

        if (error instanceof AxiosError) {
          console.error("에러 응답 데이터:", error.response?.data);
          console.error("에러 상태 코드:", error.response?.status);
          console.error("에러 헤더:", error.response?.headers);

          const errorMessage = error.response?.data?.message || error.message;
          const errorCode = error.response?.data?.code;

          alert(
            `예약 생성에 실패했습니다.\n\n` +
              `상태 코드: ${error.response?.status}\n` +
              `에러 코드: ${errorCode || "N/A"}\n` +
              `메시지: ${errorMessage}`,
          );
        } else {
          alert("예약 생성에 실패했습니다.");
        }
      },
    });
  };

  return (
    <div className="relative min-h-screen">
      <MenuHeader title="예약하기" />

      {/* 메뉴 정보 */}
      <div className="flex gap-[16px] bg-[#F3F3F3] p-[24px] mx-[-24px]">
        <div className="w-[72px] h-[72px] bg-gray-300 rounded-2xl overflow-hidden">
          <img
            src={imageUrl || basicImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
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
        {useMealCard && (
          <div className="text-[14px] text-[#7f7f7f]">
            * 급식 카드 사용 <br />
            무료 아동 급식카드는 월 3회에 한해 사용 가능합니다.
          </div>
        )}
      </div>
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[401px] bg-white border-t border-gray-100 z-50">
        <div className="p-4">
          <Button
            className="w-full text-lg py-6 cursor-pointer"
            labelName={
              createReservationMutation.isLoading ? "처리 중..." : "결제하기"
            }
            disabled={createReservationMutation.isLoading}
            onClick={handleReserveAndPay}
          />
        </div>
      </footer>
    </div>
  );
}
