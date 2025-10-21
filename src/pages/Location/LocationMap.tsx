import { useEffect, useRef } from "react";
import { postGpsLocation } from "../../api/location/location";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import type { gpsLocationSavedRequest } from "../../types/location";
import Search from "@assets/icons/search.svg?react";
import Marker from "@/assets/icons/map-marker.svg?url";
import PageHeader from "@/components/PageHeader";
import { useOnboardingState } from "@/store/useOnboardingStore";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}
export default function LocationMap() {
  const navigate = useNavigate();
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const place = searchParams.get("place");
  const address = searchParams.get("address");
  // const road = searchParams.get("road");
  // const query = searchParams.get("query");

  const returnPath = location.state?.returnPath ?? "/";
  // const owner = location.state?.owner === "owner";
  const { setTemp } = useOnboardingState();

  // const mode = location.state?.mode ?? "call-api";

  const owner = location.state === "owner" || location.state?.owner === "owner";
  const mode = location.state?.mode ?? (owner ? "fill-only" : "call-api");

  console.log(location);
  console.log(owner);
  const handleSelect = async (placePayload: gpsLocationSavedRequest) => {
    if (owner || mode === "fill-only") {
      setTemp({
        location: {
          roadAddress: String(address ?? ""),
          latitude: Number(y ?? 0),
          longitude: Number(x ?? 0),
        },
      });
      if (owner) {
        navigate("/onboarding/store");
      } else {
        navigate(returnPath, { state: { selectedPlace: placePayload } });
      }
      return;
    }
    try {
      await postGpsLocation(placePayload);
      navigate("/location/edit");
    } catch (e) {
      console.error(e);
      alert("위치 등록에 실패했습니다.");
    }
  };

  useEffect(() => {
    const kakao = window.kakao;
    if (!mapRef.current || !kakao || !x || !y) return;

    kakao.maps.load(() => {
      const lat = parseFloat(y);
      const lng = parseFloat(x);
      const centerPos = new kakao.maps.LatLng(lat, lng);

      const mapOption = {
        center: centerPos,
        level: 2,
        draggable: true,
        scrollwheel: true,
      };

      const map = new kakao.maps.Map(mapRef.current, mapOption);

      new kakao.maps.Marker({
        position: centerPos,
        map,
        image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(40, 40), {
          offset: new kakao.maps.Point(20, 20),
        }),
      });
    });
  }, [x, y]);

  const payload: gpsLocationSavedRequest = {
    buildingName: place ?? "",
    jibunAddress: address ?? "",
    latitude: Number(y ?? 0),
    longitude: Number(x ?? 0),
  };

  return (
    <div className="flex flex-col h-dvh  overflow-y-hidden relative -mx-6">
      <div className="mx-6">
        <PageHeader title="위치관리" />
      </div>
      <div ref={mapRef} className="flex-1 relative  ">
        <div
          className="absolute  flex items-center gap-2 top-0 left-1/2 -translate-x-1/2 w-full h-11 pr-3 py-4  bg-white z-50 cursor-pointer px-6"
          onClick={() => navigate(-1)}
        >
          <Search />
          <span className="flex-1 text-left">{place}</span>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="absolute bottom-0 w-full -mx-6 pt-5 pb-8 flex flex-col items-center gap-5 bg-white z-20 rounded-t-2xl ">
          <div className="flex flex-col  w-full items-start gap-1 px-6">
            <span className="subtitle-b-16">{place}</span>
            <span className="body-r-14 mb-6">{address}</span>
            <Button
              labelName="위치 등록하기"
              disabled={false}
              onClick={() => handleSelect(payload)}
              className="flex flex-col  w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
