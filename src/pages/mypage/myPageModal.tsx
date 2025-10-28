import { Logout } from "@/api/nearby/nearby";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

interface MyPageModalProps {
  onCloseModal: () => void;
}

export default function MyPageModal({ onCloseModal }: MyPageModalProps) {
  const navigate = useNavigate();
  const { resetUser } = useUserStore();
  const LogoutApi = Logout();
  const handleLogout = async () => {
    try {
      await LogoutApi.mutateAsync();
    } catch (e) {
      console.log("로그아웃에러", e);
    } finally {
      localStorage.removeItem("user");
      sessionStorage.removeItem("cached_geolocation");
      resetUser();
      navigate("/login", { replace: true });
    }
  };
  return (
    <>
      <div
        className="absolute inset-0 bg-black/40 z-[1100]"
        onClick={onCloseModal}
      />
      <div
        className="fixed left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[401px]
                       pt-5 pb-8 bg-white rounded-t-2xl z-[1101]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col w-full items-start gap-1 px-6">
          <div className="flex  flex-col  w-full gap-4">
            <p className="subtitle-b-16">로그아웃할까요?</p>
            <p className="body-r-14 text-grey-2 mb-4">
              {"다시 로그인하면 '싹싹푸드' 서비스를 이용하실 수 있어요"}
            </p>
          </div>

          <button
            className="w-full flex h-12 py-4 px-5.32rem rounded-lg items-center justify-center
                           text-white subtitle-b-16 border bg-main1 cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃하기
          </button>
        </div>
      </div>
    </>
  );
}
