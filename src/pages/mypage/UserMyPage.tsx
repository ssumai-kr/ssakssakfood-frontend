import ImgUrl from "@/assets/images/progile.png";
import Arrow from "@/assets/icons/chevron-right.svg";
import FooterNav from "@/layout/FooterNav";
import { useNavigate } from "react-router-dom";
import { useMyProfile } from "@/api/mypage/mypage";

export default function UserMyPage() {
  const navigete = useNavigate();

  const { data } = useMyProfile();

  const isCard = Boolean(localStorage.getItem("cardImg"));
  console.log(isCard);

  console.log(data);
  return (
    <div className="min-h-dvh flex flex-col ">
      <p className="text-xl font-bold mt-6 mb-6">마이페이지</p>

      <div className="flex items-center flex-col justify-center">
        <img
          src={data?.profileImageUrl || ImgUrl}
          alt=""
          className="size-27 rounded-full shrink-0 mb-4"
        />
        <p className="text-[20px] font-bold mb-2">{data?.nickname}</p>
        <p className="body-r-16 text-grey-2 mb-3">{data?.email}</p>

        <button
          className="px-4 py-2 rounded-[20px] bg-grey-5 mb-6 text-sm cursor-pointer"
          onClick={() => navigete("/mypage/edit")}
        >
          내 정보 수정
        </button>
      </div>

      <section>
        <div className="p-5 bg-grey-5 mb-2 rounded-xl flex flex-col gap-3">
          <p className="button-sb-14">설정</p>
          <div className="flex">
            <p>계정 관리</p>
            <img
              src={Arrow}
              alt="보기"
              className="ml-auto cursor-pointer"
              onClick={() => navigete("/mypage/account")}
            />
          </div>
          <div className="flex">
            <p>알림 설정</p>
            <img
              src={Arrow}
              alt="보기"
              className="ml-auto cursor-pointer"
              onClick={() => navigete("/mypage/alarm")}
            />
          </div>
          {isCard && (
            <div className="flex">
              <p>아동 급식 카드 관리</p>
              <img
                src={Arrow}
                alt="보기"
                className="ml-auto cursor-pointer"
                onClick={() => navigete("/mypage/card")}
              />
            </div>
          )}
        </div>

        <div className="p-5 bg-grey-5 rounded-xl">
          <p className="button-sb-14 mb-3">고객지원</p>
          <div className="flex">
            <p>약관 및 정책</p>
            <img
              src={Arrow}
              alt="보기"
              className="ml-auto cursor-pointer"
              onClick={() => navigete("/mypage/term")}
            />
          </div>
        </div>
      </section>
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </div>
  );
}
