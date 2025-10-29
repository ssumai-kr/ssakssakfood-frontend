import { getMemberType, MemberType } from "@/utils/getUserInfo"; // useState 임포트 제거
import Home from "@/Home";
import ManagerHome from "@/pages/ManagerHome/ManagerHome";

/**
 * memberType에 따라 다른 홈 화면을 렌더링하는 컴포넌트
 * - 비로그인 또는 USER: Home 컴포넌트
 * - OWNER: ManagerHome 컴포넌트
 */
const HomePage = () => {
  const memberType: MemberType | null = getMemberType();

  // OWNER인 경우 ManagerHome 렌더링
  if (memberType === "OWNER") {
    return <ManagerHome />;
  }

  // 비로그인 또는 USER인 경우 Home 렌더링
  return <Home />;
};

export default HomePage;
