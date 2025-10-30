import { getMemberType, MemberType } from "@/utils/getUserInfo";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import UserOrdersPage from "./UserOrderspage";
import OwnerOrdersPage from "./OwnerOrdersPage";

export default function MyOrdersPage() {
  const memberType: MemberType | null = getMemberType();
  const navigate = useNavigate();

  // 비로그인 사용자는 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!memberType) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [memberType, navigate]);

  // USER인 경우 UserOrdersPage 렌더링
  if (memberType === "USER") {
    return <UserOrdersPage />;
  }

  // OWNER인 경우 OwnerOrdersPage 렌더링
  if (memberType === "OWNER") {
    return <OwnerOrdersPage />;
  }

  // 비로그인 상태일 때는 null 반환 (리다이렉트 처리 중)
  return null;
}
