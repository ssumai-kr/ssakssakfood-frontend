import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/HomePage";
import Layout from "./layout/HomePage";
import ErrorPage from "./pages/ErrorPage";
import TermPage from "./pages/login/TermPage";
import OnBoardingConfirmPage from "./pages/onBoarding/onBoardingConfirm";
import OnBoardingPage from "./pages/onBoarding/onBoarding";
import OnBoardingPassPage from "./pages/onBoarding/onBoardingPass";
import SearchResultPage from "./pages/SearchResult/SearchResultPage";
import LocationEdit from "./pages/Location/LocationEdit";
import LocationSearch from "./pages/Location/LocationSearch";
import LocationMap from "./pages/Location/LocationMap";
import PxLayout from "./layout/PxLayoyt";
import CategoryPage from "./pages/Category/CategoryPage";
import MenuDetailPage from "./pages/Menu/MenuDetailPage";
import OnboardingNumber from "@/pages/onBoarding/onBoardingNumber";
import OnBoardingCardPage from "@/pages/onBoarding/onBoardingCard";
import OnBoardingComplete from "@/pages/onBoarding/onBoardingComplete";
import StorePage from "./pages/Store/StorePage";
import ReservePage from "./pages/Reserve/ReservePage";
import OwnerInformation from "@/pages/onBoarding/onBoardingOwner";
import StoreInformation from "@/pages/onBoarding/onBoardingStore";
import AllfoodsPage from "./pages/ManagerHome/AllFoodsPage";
import NearbyEdit from "@/pages/NearBy/NearByEdit";
import AddFoodPage from "./pages/ManagerHome/AddFoodPage";
import AuthGuard from "@/components/AuthGuard";
import NearbyPage from "./pages/NearBy/NearByPage";
import NearbyRegister from "./pages/NearBy/NearByRegister";
import MyPageEdit from "@/pages/mypage/MyPageEdit";
import MyPageAccount from "@/pages/mypage/MyPageAccount";
import MyPageLeave from "@/pages/mypage/MyPageLeave";
import MyPageCard from "@/pages/mypage/MyPageCard";
import MypageAlarm from "@/pages/mypage/MyPageAlarm";
import MypageTerm from "@/pages/mypage/MyPageTerm";
import AddFoodDetailPage from "./pages/ManagerHome/AddFoodDetailPage";
import AddFoodEditPage from "./pages/ManagerHome/AddFoodEditPage";

import RoleMyPage from "@/pages/Mypage";
import ManagerTerm from "@/pages/ManagerMyPage/ManagerTerm";
import AiInsight from "@/pages/ManagerMyPage/AiInsight";
import ManagerEdit from "@/pages/ManagerMyPage/ManagerEdit";
import MyOrdersPage from "./pages/MyReservations/MyOrdersPage";

// 비회원 접근을 막습니다.
const withAuthGuard = (Component: React.ComponentType) => {
  return (
    <AuthGuard>
      <Component />
    </AuthGuard>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchResultPage /> },
      // { path: "nearby", element: withAuthGuard(NearbyPage) },
      { path: "nearby", element: <NearbyPage /> },
      { path: "category/:slug", element: <CategoryPage /> },
    ],
  },
  {
    path: "/",
    element: <PxLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/term", element: <TermPage /> },
      { path: "*", element: <ErrorPage /> },
      // 온보딩
      { path: "/onBoarding", element: <OnBoardingPage /> },
      { path: "/onBoarding/confirm", element: <OnBoardingConfirmPage /> },
      { path: "/onBoarding/number", element: <OnboardingNumber /> },
      { path: "/onBoarding/pass", element: <OnBoardingPassPage /> },
      { path: "/onBoarding/card", element: <OnBoardingCardPage /> },
      { path: "/onBoarding/card", element: <OnBoardingCardPage /> },
      { path: "/onBoarding/complete", element: <OnBoardingComplete /> },
      { path: "/onBoarding/owner", element: <OwnerInformation /> },
      { path: "/onBoarding/store", element: <StoreInformation /> },
      //위치수정
      { path: "/location/edit", element: withAuthGuard(LocationEdit) },
      // { path: "/location/search", element: withAuthGuard(LocationSearch) },
      { path: "/location/search", element: <LocationSearch /> },
      // { path: "/location/map", element: withAuthGuard(LocationMap) },
      { path: "/location/map", element: <LocationMap /> },
      //내주변
      { path: "/nearby/register", element: withAuthGuard(NearbyRegister) },
      { path: "/nearby/edit/:routeId", element: <NearbyEdit /> },
      //매장별 식품
      { path: "/store/:id", element: withAuthGuard(StorePage) },
      //예약
      { path: "/menu/:id/reserve", element: withAuthGuard(ReservePage) },
      //사장님 Home 관련
      //오늘의 판매식품 전체보기
      { path: "/allfoods", element: withAuthGuard(AllfoodsPage) },
      //판매 시작하기
      { path: "/addfood", element: withAuthGuard(AddFoodPage) },
      { path: "/addfood/:id/edit", element: withAuthGuard(AddFoodEditPage) },
      //마이페이지
      { path: "/mypage", element: withAuthGuard(RoleMyPage) },
      { path: "/mypage/edit", element: <MyPageEdit /> },
      { path: "/mypage/account", element: <MyPageAccount /> },
      { path: "/mypage/leave", element: <MyPageLeave /> },
      { path: "/mypage/card", element: <MyPageCard /> },
      { path: "/mypage/alarm", element: <MypageAlarm /> },
      { path: "/mypage/term", element: <MypageTerm /> },
      { path: "/mypage/manager/term", element: <ManagerTerm /> },
      { path: "/mypage/insight", element: <AiInsight /> },
      { path: "/mypage/manager/edit", element: <ManagerEdit /> },
      //사장 마페
      // { path: "/mypage", element: withAuthGuard(ManagerMyPage) },
      //유저 주문내역
      { path: "/orders", element: withAuthGuard(MyOrdersPage) },
    ],
  },
  //메뉴 상세 페이지 (로그인 필수)
  { path: "menu/:id", element: withAuthGuard(MenuDetailPage) },
  { path: "/addfood/:id", element: withAuthGuard(AddFoodDetailPage) },
]);

export default router;
