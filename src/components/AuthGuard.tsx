import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "@/utils/getUserInfo";
import Modal from "@/components/onBoarding/Modal";

// 비회원도 접근 가능한 경로 목록
const PUBLIC_ROUTES = [
  "/",
  "/search",
  "/login",
  "/term",
  "/onBoarding",
  "/onBoarding/confirm",
  "/onBoarding/number",
  "/onBoarding/pass",
  "/onBoarding/card",
  "/onBoarding/complete",
  "/onBoarding/owner",
  "/onBoarding/store",
];

// 카테고리 경로 체크 함수
const isCategoryRoute = (pathname: string) => {
  return pathname.startsWith("/category/");
};

// 공개 경로인지 확인하는 함수
const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.includes(pathname) || isCategoryRoute(pathname);
};

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    const currentPath = location.pathname;

    // 비회원이고 공개되지 않은 경로에 접근하려는 경우
    if (!loggedIn && !isPublicRoute(currentPath)) {
      setShowModal(true);
    }
  }, [location.pathname, loggedIn]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  // 비로그인 상태면 children을 렌더링하지 않고 모달만 표시
  if (!loggedIn) {
    return (
      <>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex justify-center bg-gray-50">
            <div
              className="w-full max-w-[401px] flex items-center justify-center bg-main1"
              style={{ height: "100dvh" }}
            >
              <Modal
                closeModal={handleCloseModal}
                title="로그인이 필요합니다"
                subTitle="로그인 후 이용해주세요"
              />
            </div>
          </div>
        )}
      </>
    );
  }

  // 로그인 상태면 children 렌더링
  return <>{children}</>;
}
