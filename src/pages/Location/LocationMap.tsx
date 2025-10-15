import { useEffect, useRef } from "react";
import { postGpsLocation } from "../../api/location/location";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import type { gpsLocationSavedRequest } from "../../types/location";
import Search from "@assets/icons/search.svg?react";
import Marker from "@/assets/icons/map-marker.svg?url";
import PageHeader from "@/components/PageHeader";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}
export default function LocationMap() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const x = searchParams.get("x");
  const y = searchParams.get("y");
  const place = searchParams.get("place");
  const address = searchParams.get("address");
  // const road = searchParams.get("road");
  // const query = searchParams.get("query");

  const location = useLocation();
  const returnPath = location.state?.returnPath ?? "/";
  const mode = location.state?.mode ?? "call-api";
  const handleSelect = async (place: gpsLocationSavedRequest) => {
    if (mode === "call-api") {
      await postGpsLocation(payload);
      navigate("/location/edit");
    } else {
      navigate(returnPath, { state: { selectedPlace: place } });
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
    <div className="flex flex-col h-dvh max-w-[401px] overflow-y-hidden relative">
      <PageHeader title="위치관리" />

      <div ref={mapRef} className="flex-1 relative  max-w-[401px] ">
        <div
          className="absolute  flex items-center gap-2 top-0 left-1/2 -translate-x-1/2 w-full h-11 pr-3 py-4  bg-white z-50 cursor-pointer "
          onClick={() => navigate(-1)}
        >
          <Search />
          <span className="flex-1 text-left">{place}</span>
        </div>
      </div>
      <div className="absolute bottom-0 w-full max-w-[353px] pt-5 pb-6 flex flex-col items-center gap-5 bg-white z-20 rounded-t-2xl ">
        <div className="flex flex-col px-2  w-full items-start gap-1 ">
          <span className="subtitle-b-16">{place}</span>
          <span className="body-r-14">{address}</span>
        </div>
        <Button
          labelName="위치 등록하기"
          disabled={false}
          onClick={() => handleSelect(payload)}
        />
      </div>
    </div>
  );
}
