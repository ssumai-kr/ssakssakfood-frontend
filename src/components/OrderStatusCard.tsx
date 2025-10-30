import BasicImg from "@/assets/images/basic.svg";
// interface OrderStatusCardProps {
//   menuName: string;
//   storeName: string;
//   menuImageUrl: string;
//   foodQuantity: number;
//   totalAmount: number;
//   reservedAt: string;
//   pickupTime: string;
//   status: string;
// }

//status가 "PENDING" 이면, "예약 확인 중"
//status가 "COMPLETED"면 "예약 확정"
//status가 "CANCELED"이면 "예약 취소됨"

export default function OrderStatusCard() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-[16px] font-semibold">10.07 (화) 13:00</div>
        <div className="text-[14px] font-medium text-[#FE7549] bg-[#FFF2ED] px-3 py-2 rounded-2xl">
          예약 확정
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <img src={BasicImg} alt="메뉴 이미지" className="w-[88px] h-[88px]" />
        <div className="flex flex-col gap-1">
          <div className="text-[18px] font-bold flex gap-2 items-center">
            식빵
            <span className="text-[14px] font-semibold text-[#7F7F7F]">
              파리바게뜨
            </span>
          </div>
          <div className="text-[14px] font-normal text-[#7F7F7F] flex gap-2  items-center">
            수량<span>1</span>
          </div>
          <div className="text-[14px] font-normal text-[#7F7F7F] flex gap-2  items-center">
            결제금액<span>13,900원</span>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF2ED] rounded-2xl p-4 flex flex-col gap-2 mt-3">
        <div className="text-[18px] font-bold flex gap-4">
          픽업시간 <span>10.07(화) 19:00</span>
        </div>
        <div className="text-[12px] text-[#F30000] font-normal">
          * 픽업 시간을 꼭 지켜주세요.
        </div>
      </div>
    </div>
  );
}
