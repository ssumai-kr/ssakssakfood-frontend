import { Outlet } from "react-router-dom";
import { LocationHeader } from "../components/Headers";
import FooterNav from "./FooterNav";
import SearchInput from "@/components/SearchInput";
import useGeolocation from "@/hooks/useGeolocation";

export default function Layout() {
  const { fullAdress, loading, error } = useGeolocation();
  //Layout 분리 예정
  const displayLocation = loading
    ? "위치 정보를 불러오는 중..."
    : error
      ? "위치 정보를 가져올 수 없습니다."
      : fullAdress || "위치를 확인할 수 없음";

  return (
    <>
      <div className="w-full sticky top-0 z-[1000] bg-white py-2">
        <LocationHeader location={displayLocation} />
        <SearchInput className="bg-[#F3F3F3] px-[16px] py-[10px] rounded-3xl mx-6" />
      </div>

      <main className="px-6 w-full">
        <Outlet />
      </main>

      <footer className="fixed bottom-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </>
  );
}
