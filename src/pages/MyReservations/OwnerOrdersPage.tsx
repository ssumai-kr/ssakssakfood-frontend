import { useState, useMemo } from "react";
import OwnerOrderStatusCard from "@/components/OwnerOrderStatusCard";
import ChevronDown from "@/assets/icons/chevron-down.svg";
import OwnerFooterNav from "@/layout/OwnerFooterNav";
import DateFilterModal from "@/components/MonthCalendar";
import { useGetOwnerProfile } from "@/api/mypage/mypage";
import { useGetStoreReservationsByDate } from "@/api/reservation/reservation";

export default function OwnerOrdersPage() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const DAY = ["일", "월", "화", "수", "목", "금", "토"];

  // 사장님 프로필에서 storeId 가져오기
  const { data: ownerProfile } = useGetOwnerProfile();
  const storeId = ownerProfile?.store?.id;

  // 날짜 포맷팅 (yyyy-MM-dd)
  const formattedDateForAPI = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const date = selectedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${date}`;
  }, [selectedDate]);

  // 예약 내역 조회
  const {
    data: reservations,
    isLoading,
    error,
  } = useGetStoreReservationsByDate(storeId, formattedDateForAPI);

  // "삭제된 메뉴" 필터링 및 PENDING, CONFIRMED 상태만 표시, 픽업 시간이 지나지 않은 예약만 표시
  const filteredReservations = useMemo(() => {
    const now = new Date();
    return (
      reservations?.filter(
        (reservation) =>
          reservation.menuName !== "삭제된 메뉴" &&
          (reservation.status === "PENDING" ||
            reservation.status === "CONFIRMED") &&
          new Date(reservation.pickupTime) > now,
      ) || []
    );
  }, [reservations]);

  // 화면에 표시할 날짜 포맷 (MM.DD)
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const formattedDate = `${month.toString().padStart(2, "0")}.${date.toString().padStart(2, "0")}`;
  const dayOfWeek = DAY[selectedDate.getDay()];

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-bold my-6">주문내역</h1>
          <div
            className="flex gap-1 border border-[#DFDFDF] rounded-2xl px-2 py-1 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {formattedDate}({dayOfWeek}) <img src={ChevronDown} alt="날짜" />
          </div>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[#7F7F7F]">로딩 중...</p>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
          <OwnerFooterNav />
        </footer>
      </div>
    );
  }

  if (error) {
    console.error("예약 내역 조회 실패:", error);
    return (
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-[20px] font-bold my-6">주문내역</h1>
          <div
            className="flex gap-1 border border-[#DFDFDF] rounded-2xl px-2 py-1 cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {formattedDate}({dayOfWeek}) <img src={ChevronDown} alt="날짜" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[200px] gap-4">
          <p className="text-[#7F7F7F]">예약 내역을 불러오는데 실패했습니다.</p>
          <p className="text-[14px] text-[#A8A8A8]">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
          <OwnerFooterNav />
        </footer>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-[20px] font-bold my-6">주문내역</h1>
        <div
          className="flex gap-1 border border-[#DFDFDF] rounded-2xl px-2 py-1 cursor-pointer"
          onClick={() => setOpen(true)}
        >
          {formattedDate}({dayOfWeek}) <img src={ChevronDown} alt="날짜" />
        </div>
      </div>

      {filteredReservations.length > 0 ? (
        <div className="flex flex-col gap-6 pb-24">
          {filteredReservations.map((reservation) => (
            <OwnerOrderStatusCard
              key={reservation.reservationId}
              reservation={reservation}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[#7F7F7F]">예약 내역이 없습니다.</p>
        </div>
      )}

      <DateFilterModal
        open={open}
        onClose={() => setOpen(false)}
        selectedDate={selectedDate}
        onSelect={(d) => {
          setSelectedDate(d);
          setOpen(false);
        }}
      />

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <OwnerFooterNav />
      </footer>
    </div>
  );
}
