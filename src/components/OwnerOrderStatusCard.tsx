import { useState } from "react";
import BasicImg from "@/assets/images/basic.svg";
import Button from "./Button";
import ReservationConfirmModal from "./ReservationConfirmModal";
import Modal from "./onBoarding/Modal";
import type { OwnerReservationDto } from "@/types/reservation";
import {
  useCancelReservation,
  useConfirmReservation,
} from "@/api/reservation/reservation";
import { useQueryClient } from "react-query";

interface OwnerOrderStatusCardProps {
  reservation: OwnerReservationDto;
}

export default function OwnerOrderStatusCard({
  reservation,
}: OwnerOrderStatusCardProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showConfirmConfirm, setShowConfirmConfirm] = useState(false);
  const [showCancelComplete, setShowCancelComplete] = useState(false);
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);

  const queryClient = useQueryClient();
  const cancelMutation = useCancelReservation();
  const confirmMutation = useConfirmReservation();

  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };

  const handleConfirmClick = () => {
    setShowConfirmConfirm(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    cancelMutation.mutate(reservation.reservationId, {
      onSuccess: () => {
        setShowCancelComplete(true);
        // 예약 목록 새로고침
        queryClient.invalidateQueries(["storeReservations"]);
      },
      onError: (error) => {
        console.error("예약 취소 실패:", error);
        alert("예약 취소에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  const handleConfirmConfirm = () => {
    setShowConfirmConfirm(false);
    confirmMutation.mutate(reservation.reservationId, {
      onSuccess: () => {
        setShowConfirmComplete(true);
        // 예약 목록 새로고침
        queryClient.invalidateQueries(["storeReservations"]);
      },
      onError: (error) => {
        console.error("예약 확정 실패:", error);
        alert("예약 확정에 실패했습니다. 다시 시도해주세요.");
      },
    });
  };

  // 날짜 포맷팅
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${month}.${day}(${dayOfWeek}) ${hours}:${minutes}`;
  };

  // 전화번호 마스킹
  const maskPhoneNumber = (phone: string | null | undefined) => {
    if (!phone) return "";
    if (phone.length === 11) {
      return `${phone.slice(0, 3)}-****-${phone.slice(7)}`;
    }
    return phone;
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className="text-[20px] font-bold flex gap-2 items-center">
          {reservation.customerName}님
          <span className="text-[14px] font-normal">
            {maskPhoneNumber(reservation.customerPhone)}
          </span>
        </div>
      </div>
      <div className="flex gap-4 items-center mt-4">
        <img
          src={reservation.menuImageUrl || BasicImg}
          alt="메뉴 이미지"
          className="w-[72px] h-[72px] object-cover rounded-2xl"
        />
        <div className="flex flex-col gap-1">
          <div className="text-[18px] font-bold flex gap-2 items-center">
            {reservation.menuName}
          </div>
          <div className="text-[14px] font-normal text-[#7F7F7F] flex gap-2 items-center">
            결제금액<span>{reservation.totalAmount.toLocaleString()}원</span>
          </div>
        </div>
      </div>
      <div className="bg-[#FFF2ED] rounded-2xl p-4 flex flex-col gap-2 mt-3">
        <div className="text-[18px] font-bold flex gap-4">
          수량{" "}
          <span className="text-[#FE7549]">{reservation.foodQuantity}개</span>
        </div>
        <div className="text-[18px] font-bold flex gap-4">
          픽업시간{" "}
          <span className="text-[#FE7549]">
            {formatDateTime(reservation.pickupTime)}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button
          labelName="예약 취소"
          className="flex-1 cursor-pointer"
          disabled={false}
          variant="secondary"
          onClick={handleCancelClick}
        />
        <Button
          labelName="예약 확정"
          className="flex-[2] cursor-pointer"
          disabled={false}
          onClick={handleConfirmClick}
        />
      </div>

      <ReservationConfirmModal
        isOpen={showCancelConfirm}
        type="cancel"
        onConfirm={handleCancelConfirm}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <ReservationConfirmModal
        isOpen={showConfirmConfirm}
        type="confirm"
        onConfirm={handleConfirmConfirm}
        onCancel={() => setShowConfirmConfirm(false)}
      />

      {showCancelComplete && (
        <div className="fixed inset-0 z-10">
          <Modal
            closeModal={() => setShowCancelComplete(false)}
            title="예약이 취소되었어요"
          />
        </div>
      )}

      {showConfirmComplete && (
        <div className="fixed inset-0 z-10">
          <Modal
            closeModal={() => setShowConfirmComplete(false)}
            title="고객 예약이 확정되었습니다!"
          />
        </div>
      )}
    </div>
  );
}
