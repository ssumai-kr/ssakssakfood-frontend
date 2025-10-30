interface ReservationConfirmModalProps {
  isOpen: boolean;
  type: "cancel" | "confirm";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ReservationConfirmModal({
  isOpen,
  type,
  onConfirm,
  onCancel,
}: ReservationConfirmModalProps) {
  if (!isOpen) return null;

  const title =
    type === "cancel" ? "고객 예약을 취소할까요?" : "고객 예약을 확정할까요?";
  const message =
    type === "cancel"
      ? "취소 시 고객에게 알림이 발송되며, 예약은 복구가 불가능합니다."
      : "고객에게 확정 알림이 전송됩니다.";
  const confirmButtonText =
    type === "cancel" ? "예약 취소하기" : "예약 확정하기";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>
      <div className="relative z-[101] w-[90%] max-w-[320px] bg-white rounded-2xl p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-[18px] font-bold">{title}</h2>
            <p className="text-[14px] text-[#7F7F7F]">{message}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-[#F3F3F3] text-[#7F7F7F] rounded-lg font-semibold"
            >
              아니요
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 bg-[#FE7549] text-white rounded-lg font-semibold"
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
