import Close from "@assets/icons/x-close.svg";
import Check from "@/assets/icons/check-full.svg";
interface ModalProps {
  closeModal: () => void;
  title?: string;
  subTitle?: string;
}

export default function Modal({ closeModal, title, subTitle }: ModalProps) {
  return (
    // <div className="fixed inset-0 z-10">
    <>
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center p-6 ">
        <div className="relative flex flex-col items-center justify-centerw-full w-90 rounded-2xl bg-white p-6 ">
          <img src={Check} alt="" className="mb-6 size-10" />
          <p className="text-xl font-bold mb-3">{title}</p>
          <img
            src={Close}
            alt="닫기"
            className="absolute top-4 right-4 cursor-pointer"
            onClick={closeModal}
          />

          <p className="body-r-14 text-grey-2">{subTitle}</p>
        </div>
      </div>
    </>
    // </div>
  );
}
