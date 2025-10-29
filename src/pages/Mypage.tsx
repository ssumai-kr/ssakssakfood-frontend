import { getMemberType, MemberType } from "@/utils/getUserInfo"; // useState 임포트 제거
import ManagerMyPage from "@/pages/ManagerMyPage/ManagerMypage";
import UserMyPage from "@/pages/mypage/UserMyPage";

const RoleMyPage = () => {
  const memberType: MemberType | null = getMemberType();

  // OWNER인 경우 ManagerHome 렌더링
  if (memberType === "OWNER") {
    return <ManagerMyPage />;
  }
  // 비로그인 또는 USER인 경우 Home 렌더링
  return <UserMyPage />;
};

export default RoleMyPage;
