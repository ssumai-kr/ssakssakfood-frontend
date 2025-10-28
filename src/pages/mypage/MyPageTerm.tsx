import PageHeader from "@/components/PageHeader";
import Arrow from "@/assets/icons/chevron-right.svg";
export default function MypageTerm() {
  return (
    <div>
      <PageHeader title="약관 및 정책" />
      <div className="mb-4 flex justify-between mt-6">
        <p>서비스 이용약관</p>
        <img src={Arrow} alt="" />
      </div>
      <div className="mb-4 flex justify-between">
        <p>개인정보 처리방침</p>
        <img src={Arrow} alt="" />
      </div>
      <div className="mb-4 flex justify-between">
        <p>마케팅 정보 수신</p>
        <img src={Arrow} alt="" />
      </div>
    </div>
  );
}
