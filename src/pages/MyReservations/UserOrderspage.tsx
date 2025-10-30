import { useEffect } from "react";
import OrderStatusCard from "@/components/OrderStatusCard";
import FooterNav from "@/layout/FooterNav";
import { useGetMyReservations } from "@/api/reservation/reservation";

export default function UserOrdersPage() {
  const { data: reservations, isLoading, error } = useGetMyReservations();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div>
        <h1 className="text-[20px] font-bold my-6">주문 내역</h1>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[#7F7F7F]">불러오는 중...</p>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
          <FooterNav />
        </footer>
      </div>
    );
  }

  if (error) {
    console.error("예약 내역 조회 실패:", error);
    return (
      <div>
        <h1 className="text-[20px] font-bold my-6">주문 내역</h1>
        <div className="flex flex-col items-center justify-center h-[200px] gap-4">
          <p className="text-[#7F7F7F]">예약 내역을 불러오는데 실패했습니다.</p>
          <p className="text-[14px] text-[#A8A8A8]">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
        <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
          <FooterNav />
        </footer>
      </div>
    );
  }

  // "삭제된 메뉴" 필터링
  const filteredReservations =
    reservations?.filter(
      (reservation) => reservation.menuName !== "삭제된 메뉴",
    ) || [];

  return (
    <div>
      <h1 className="text-[20px] font-bold my-6">주문 내역</h1>
      {filteredReservations.length > 0 ? (
        <div className="flex flex-col gap-6 pb-24">
          {filteredReservations.map((reservation) => (
            <OrderStatusCard
              key={reservation.reservationId}
              menuName={reservation.menuName}
              storeName={reservation.storeName}
              menuImageUrl={reservation.menuImageUrl}
              foodQuantity={reservation.foodQuantity}
              totalAmount={reservation.totalAmount}
              reservedAt={reservation.reservedAt}
              pickupTime={reservation.pickupTime}
              status={reservation.status}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[#7F7F7F]">예약 내역이 없습니다.</p>
        </div>
      )}
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </div>
  );
}
