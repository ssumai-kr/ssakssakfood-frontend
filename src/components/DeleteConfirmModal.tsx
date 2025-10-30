interface DeleteConfirmModalProps {
  isOpen: boolean;
  menuName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  menuName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel}></div>
      <div className="relative z-[101] w-[90%] max-w-[320px] bg-white rounded-2xl p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-[18px] font-bold">식품 삭제</h2>
            <p className="text-[14px] text-[#7F7F7F]">
              <span className="font-semibold text-black">{menuName}</span>{" "}
              식품을
              <br />
              정말 삭제하시겠습니까?
            </p>
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
              네
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
