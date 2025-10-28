import { Outlet, useLocation } from "react-router-dom";
import { LocationHeader } from "../components/Headers";
import SearchInput from "@/components/SearchInput";
import useGeolocation from "@/hooks/useGeolocation";
import { getMemberType, isLoggedIn } from "@/utils/getUserInfo";
import { useGetMyPrimaryLocation } from "@/api/location/location";

export default function Layout() {
  const { fullAdress, loading: geoLoading, error: geoError } = useGeolocation();
  const location = useLocation();
  const memberType = getMemberType();
  const loggedIn = isLoggedIn();

  // 로그인한 경우에만 대표 주소 조회
  const { data: primaryLocationData, isLoading: isPrimaryLoading } =
    useGetMyPrimaryLocation(loggedIn);

  const primaryLocation = primaryLocationData;

  // 표시할 위치 결정 로직
  const getDisplayLocation = () => {
    // 로그인하지 않은 경우: geolocation 사용
    if (!loggedIn) {
      if (geoLoading) return "위치 정보를 불러오는 중...";
      if (geoError) return "위치 정보를 가져올 수 없습니다.";
      return fullAdress || "위치를 확인할 수 없음";
    }

    // 로그인한 경우: 대표 주소가 있으면 사용, 없으면 geolocation 사용
    if (isPrimaryLoading) return "위치 정보를 불러오는 중...";

    if (primaryLocation) {
      // 대표 주소가 있는 경우: jibunAddress 사용
      return (
        primaryLocation.jibunAddress ||
        primaryLocation.displayName ||
        primaryLocation.buildingName
      );
    }

    // 대표 주소가 없는 경우: geolocation 사용
    if (geoLoading) return "위치 정보를 불러오는 중...";
    if (geoError) return "위치 정보를 가져올 수 없습니다.";
    return fullAdress || "위치를 확인할 수 없음";
  };

  const displayLocation = getDisplayLocation();

  // OWNER이고 루트 경로("/")인 경우 헤더를 보여주지 않음
  const shouldShowHeader = !(
    memberType === "OWNER" && location.pathname === "/"
  );

  return (
    <div className="w-full max-w-[401px] mx-auto overflow-x-hidden">
      {shouldShowHeader && (
        <div className="w-full sticky top-0 z-[1000] bg-white py-2">
          <LocationHeader location={displayLocation} />
          <SearchInput className="bg-[#F3F3F3] px-[16px] py-[10px] rounded-3xl mx-6" />
        </div>
      )}
      <main className="px-6">
        <Outlet />
      </main>
    </div>
  );
}
