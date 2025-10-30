import BasicImg from "@/assets/images/basic.svg";

interface OrderStatusCardProps {
  menuName: string;
  storeName: string;
  menuImageUrl: string;
  foodQuantity: number;
  totalAmount: number;
  reservedAt: string;
  pickupTime: string;
  status: string;
  isShared: boolean;
}

//status가 "PENDING" 이면, "결제 대기 중"
//status가 "CONFIRMED"면 "결제 완료"
//status가 "COMPLETED"면 "예약 확정" -> *픽업시간을 꼭 지켜주세요 표시 추가
//status가 "CANCELED"이면 "예약 취소됨" -> 배경색 #EDF1FF, 글자색 #496FF8로 바뀜.

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = days[date.getDay()];
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
};

const getStatusLabel = (status: string, isExpired: boolean) => {
  // PENDING이면서 픽업 시간이 지난 경우 취소로 표시
  if (status === "PENDING" && isExpired) {
    return "예약 취소됨";
  }

  switch (status) {
    case "PENDING":
      return "결제 대기 중";
    case "CONFIRMED":
      return "예약 확인중";
    case "COMPLETED":
      return "예약 확정";
    case "CANCELED":
      return "예약 취소됨";
    default:
      return status;
  }
};

const getStatusStyle = (status: string, isExpired: boolean) => {
  // PENDING이면서 픽업 시간이 지난 경우 취소 스타일 적용
  if ((status === "PENDING" && isExpired) || status === "CANCELED") {
    return "text-[#496FF8] bg-[#EDF1FF]";
  }
  return "text-[#FE7549] bg-[#FFF2ED]";
};

export default function OrderStatusCard({
  menuName,
  storeName,
  menuImageUrl,
  foodQuantity,
  totalAmount,
  reservedAt,
  pickupTime,
  status,
  isShared,
}: OrderStatusCardProps) {
  // 픽업 시간이 지났는지 확인
  const isPickupTimeExpired = new Date(pickupTime) < new Date();
  const isExpiredPending = status === "PENDING" && isPickupTimeExpired;

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-[16px] font-semibold">
          {formatDateTime(reservedAt)}
        </div>
        <div
          className={`text-[14px] font-medium px-3 py-2 rounded-2xl ${getStatusStyle(status, isPickupTimeExpired)}`}
        >
          {getStatusLabel(status, isPickupTimeExpired)}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <img
          src={menuImageUrl || BasicImg}
          alt="메뉴 이미지"
          className="w-[88px] h-[88px] object-cover rounded-2xl"
        />
        <div className="flex flex-col gap-1">
          <div className="text-[18px] font-bold flex gap-2 items-center">
            {menuName}
            <span className="text-[14px] font-semibold text-[#7F7F7F]">
              {storeName}
            </span>
          </div>
          <div className="text-[14px] font-normal text-[#7F7F7F] flex gap-2 items-center">
            수량<span>{foodQuantity}</span>
          </div>
          <div className="text-[14px] font-normal text-[#7F7F7F] flex gap-2 items-center">
            결제금액
            {isShared ? (
              <span className="flex gap-1 items-center">
                <span className="line-through">
                  {totalAmount.toLocaleString()}원
                </span>
                <span className="text-[#FE7549] font-bold">0원</span>
              </span>
            ) : (
              <span>{totalAmount.toLocaleString()}원</span>
            )}
          </div>
          {isShared && (
            <div className="text-[10px] text-[#FE7549] font-medium bg-[#FFF2ED] px-2 py-1 rounded w-fit">
              급식 카드 사용
            </div>
          )}
        </div>
      </div>
      {(status === "PENDING" ||
        status === "CONFIRMED" ||
        status === "COMPLETED") &&
        !isExpiredPending && (
          <div className="bg-[#FFF2ED] rounded-2xl p-4 flex flex-col gap-2 mt-3">
            <div className="text-[18px] font-bold flex gap-4">
              픽업시간 <span>{formatDateTime(pickupTime)}</span>
            </div>
            {status === "COMPLETED" && (
              <div className="text-[12px] text-[#F30000] font-normal">
                * 픽업 시간을 꼭 지켜주세요.
              </div>
            )}
          </div>
        )}
      {(status === "CANCELED" || isExpiredPending) && (
        <div className="bg-[#EDF1FF] rounded-2xl p-4 flex flex-col gap-2 mt-3">
          <div className="text-[18px] font-bold flex gap-4">
            취소 사유: <span>재고 없음</span>
          </div>
        </div>
      )}
    </div>
  );
}
