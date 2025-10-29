import ImgUrl from "@/assets/images/progile.png";
import Top from "@/assets/icons/top.svg";
import Phone from "@/assets/icons/phone.svg";
import Marker from "@/assets/icons/marker-grey.svg";
import Arrow from "@/assets/icons/chevron-right.svg";
import ArrowD from "@/assets/icons/chevron-down.svg";
import Ai from "@/assets/images/AI.png";
import Graph from "@/assets/images/bar-graph.png";
import foodImgUrl from "@/assets/images/logo.png";

import { useNavigate } from "react-router-dom";
import { useGetOwnerProfile } from "@/api/mypage/mypage";
import OwnerFooterNav from "@/layout/OwnerFooterNav";

export default function ManagerMyPage() {
  const DAY = ["일", "월", "화", "수", "목", "금", "토"];

  const { data } = useGetOwnerProfile();
  console.log(data);
  const navigate = useNavigate();
  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const day = `${month.toString().padStart(2, "0")}.${date
    .toString()
    .padStart(2, "0")}`;
  const dayday = DAY[today.getDay()];
  console.log(today);

  // console.log(data);
  return (
    <div className="min-h-dvh flex flex-col pb-20">
      <div className="flex justify-between">
        <p className="text-xl font-bold mt-6 mb-6">마이페이지</p>
        <img
          src={Top}
          alt="설정"
          onClick={() => navigate("/mypage/manager/term")}
        />
      </div>

      <div className="flex items-center flex-col justify-center border-b border-b-grey-5">
        <img
          src={data?.profileImageUrl || ImgUrl}
          alt=""
          className="size-27 rounded-full shrink-0 mb-4"
        />
        <p className="text-[20px] font-bold mb-2">{data?.nickname}</p>
        <p className="body-r-16 text-grey-2 mb-4">
          {data?.store.name} | 12389+
        </p>
      </div>
      <div className="py-2 border-b border-grey-5 mb-6">
        <div className="flex gap-2 body-r-14 mb-2 text-grey-2 items-center">
          <img src={Marker} alt="" />
          <p>{data?.store.roadAddress}</p>
        </div>
        <div className="flex gap-2 body-r-14 text-grey-2 items-center">
          <img src={Phone} alt="" className="size-5" />
          <p>{data?.phone}</p>
        </div>
      </div>
      {/* 인사이트 */}
      <section className="flex flex-col gap-2">
        <div
          className="p-4 cursor-pointer bg-grey-5 rounded-lg flex items-center gap-4"
          onClick={() => navigate("/mypage/insight")}
        >
          <img src={Ai} alt="" />
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <p className="subtitle-b-16">AI 인사이트</p>
              <div className="text-grey-2 text-sm">
                <p>요약 리포트와 발주 권고를 AI가</p>
                <p>한눈에 정리해줘요!</p>
              </div>
            </div>
            <img src={Arrow} alt="" className="size-6" />
          </div>
        </div>

        <div className="p-4 bg-grey-5 rounded-lg flex flex-col mb-6">
          <div className="flex mb-3">
            <p>
              {day} ({dayday})
            </p>
            <img src={ArrowD} alt="" />
          </div>
          <div className="flex subtitle-b-18 gap-1 mb-4">
            <p>판매량</p>
            <p className="text-main1">64%</p>
            <p className="text-grey-3">/</p>
            <p>폐기량</p>
            <p className="text-main1">36%</p>
          </div>

          <img src={Graph} alt="그래프" />
          <div className="flex gap-[27px] ml-[15px]">
            {DAY.map((day, i) => {
              return <p key={i}>{day}</p>;
            })}
          </div>
        </div>

        <h3 className="text-xl font-bold">음식별 판매량</h3>

        <div className="flex gap-4">
          <img src={foodImgUrl} alt="" className="size-20 rounded-sm" />
          <div>
            <h4 className="subtitle-b-18 mb-2">식빵</h4>
            <div className="flex button-sb-14 gap-2">
              <p className="text-grey-2 mb-2">판매량</p>
              <p className="text-main1">30개</p>
            </div>
            <div className="flex button-sb-14 gap-2">
              <p className="text-grey-2 gap-2 mb-2">폐기량</p>
              <p className="text-main1">5개</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <OwnerFooterNav />
      </footer>
    </div>
  );
}
