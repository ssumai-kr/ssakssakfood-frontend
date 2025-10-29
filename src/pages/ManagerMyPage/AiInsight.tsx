import PageHeader from "@/components/PageHeader";
import One from "@/assets/icons/one.svg";
import Two from "@/assets/icons/two.svg";
import Three from "@/assets/icons/three.svg";
import Ellipse from "@/assets/images/Ellipse.png";
import NoneEllipse from "@/assets/images/NoneEllipse.png";
export default function AiInsight() {
  return (
    <div className="min-h-dvh flex flex-col pb-20">
      <PageHeader title="AI 인사이트" />
      <p className="text-xl font-bold mt-6 mb-6">AI 요약 리포트</p>
      <div className="relative flex items-center justify-center">
        <img
          src={NoneEllipse}
          alt=""
          className="absolute left-1/2 -translate-x-1/2"
        />
        <img className="relative left-2.5" src={Ellipse} alt="" />
        <p className="absolute left-1/2 -translate-x-1/2 subtitle-b-16 top-15">
          이번주 판매율
        </p>
        <p className="absolute left-1/2 -translate-x-1/2 bottom-12 text-xl font-bold text-main1">
          64%
        </p>
      </div>
      <div className="flex items-center justify-center mt-6 font-semibold mb-6">
        <p className="pr-2 ">
          저번주 대비
          <p className="text-main1 inline"> 1.2% </p>
          판매율이 올라갔어요!
        </p>
      </div>
      <section className="flex flex-col gap-2 mb-6">
        <div className="p-4 bg-grey-5 rounded-lg">
          <h3 className="subtitle-b-16 mb-4">폐기율 높은 메뉴 TOP3</h3>
          <div className="flex gap-3 flex-col">
            <div className="flex gap-2">
              <img src={One} alt="1등" />
              <p className="body-r-14">식빵</p>
            </div>
            <div className="flex gap-2">
              <img src={Two} alt="1등" />
              <p className="body-r-14">크루와상</p>
            </div>
            <div className="flex gap-2">
              <img src={Three} alt="1등" />
              <p className="body-r-14">마늘빵</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-grey-5 rounded-lg">
          <h3 className="subtitle-b-16 mb-4">판매율 높은 메뉴 TOP3</h3>
          <div className="flex gap-3 flex-col">
            <div className="flex gap-2">
              <img src={One} alt="1등" />
              <p className="body-r-14">식빵</p>
            </div>
            <div className="flex gap-2">
              <img src={Two} alt="1등" />
              <p className="body-r-14">크루와상</p>
            </div>
            <div className="flex gap-2">
              <img src={Three} alt="1등" />
              <p className="body-r-14">마늘빵</p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h3 className="text-xl font-bold flex mb-4">
          <p className="pr-1"> 싹싹푸드의 </p>
          <p className="text-main1">추천!</p>
        </h3>
        <div className="p-4 bg-grey-5 rounded-lg mb-2">
          <h4 className="mb-4 subtitle-b-16">판매량 기반 시간대별 추천</h4>
          <p className="text-grey-2 text-sm font-normal">
            판매량 기반 시간대별 추천 판매량 기반 시간대별 추천판매량 기반
            시간대별 추천판매량 기반 시간대별 추천판매량 기반 시간대별
            추천판매량 기반 시간대별 추천판매량 기반 시간대별 추천
          </p>
        </div>
        <div className="p-4 bg-grey-5 rounded-lg mb-2">
          <h4 className="mb-4 subtitle-b-16">폐기량 기반 발주 권고</h4>
          <p className="text-grey-2 text-sm font-normal">
            판매량 기반 시간대별 추천 판매량 기반 시간대별 추천판매량 기반
            시간대별 추천판매량 기반 시간대별 추천판매량 기반 시간대별
            추천판매량 기반 시간대별 추천판매량 기반 시간대별 추천
          </p>
        </div>
      </section>
    </div>
  );
}
