import PageHeader from "@/components/PageHeader";
import ImgUrl from "@/assets/images/logo.png";
export default function MyPageEdit() {
  return (
    <div>
      <PageHeader title="내 정보 수정" />
      <div>
        <img src={ImgUrl} alt="" />
      </div>
    </div>
  );
}
