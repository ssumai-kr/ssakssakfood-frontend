import PageHeader from "@/components/PageHeader";
import Arrow from "@/assets/icons/chevron-right.svg";
import { useNavigate } from "react-router-dom";
export default function ManagerTerm() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="설정" />
      <div className="mb-4 flex justify-between mt-6">
        <p>내 정보 수정</p>
        <img
          src={Arrow}
          alt="더보기"
          className="cursor-pointer"
          onClick={() => navigate("/mypage/manager/edit")}
        />
      </div>
      <div className="mb-4 flex justify-between">
        <p>계정 관리</p>
        <img
          src={Arrow}
          alt="더보기"
          onClick={() => navigate("/mypage/account")}
          className="cursor-pointer"
        />
      </div>
      <div className="mb-4 flex justify-between">
        <p>알림 설정</p>
        <img
          src={Arrow}
          alt="더보기"
          onClick={() => navigate("/mypage/alarm")}
          className="cursor-pointer"
        />
      </div>
      <div className="mb-4 flex justify-between">
        <p>약관 및 정책</p>
        <img
          src={Arrow}
          alt="더보기"
          onClick={() => navigate("/mypage/term")}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
