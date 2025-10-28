import { useMyProfile } from "@/api/mypage/mypage";
import PageHeader from "@/components/PageHeader";
import MyPageModal from "@/pages/mypage/myPageModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPageAccount() {
  const { data } = useMyProfile();
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="계정 관리" />
      <div className="flex justify-between py-6 border-b-1 border-grey-5">
        <p className="subtitle-b-16">이메일</p>
        <p className="body-r-16 text-grey-2">{data?.email}</p>
      </div>

      <p className="py-6 cursor-pointer" onClick={() => setModal(true)}>
        로그아웃
      </p>
      <p className="cursor-pointer" onClick={() => navigate("/mypage/leave")}>
        회원탈퇴
      </p>
      {modal && <MyPageModal onCloseModal={() => setModal(false)} />}
    </div>
  );
}
