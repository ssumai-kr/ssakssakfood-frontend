import InputField2 from "@/components/InputField2";
import PageHeader from "@/components/PageHeader";
import Switch from "@/assets/icons/switch.svg";
import BDot from "@/assets/icons/blue-dot.svg";
import RDot from "@/assets/icons/red-dot.svg";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";
import { useNearbyState } from "@/store/useRouteStore";
import RouteMap from "@/pages/NearBy/NearbyMap";
import { useRouteRegister } from "@/api/nearby/nearby";
import { useState } from "react";

type LatLng = { lat: number; lng: number };
export default function NearbyRegister() {
  const navigate = useNavigate();
  const {
    start,
    startJibunAddress,
    end,
    endJibunAddress,
    setTemp,
    routeName,
    reset,
  } = useNearbyState();
  // const { setTemp: uiSetTemp } = useNearbyUiState();
  const [routeValue, setRouteValue] = useState(routeName || "");
  const [polyline, setPolyline] = useState<LatLng[]>([]);

  const routeRegister = useRouteRegister();
  const handleRouteRegister = () => {
    routeRegister.mutate({
      start: {
        lat: Number(start?.lat),
        lng: Number(start?.lng),
      },
      startName: startJibunAddress,
      startJibunAddress,
      end: {
        lat: Number(end?.lat),
        lng: Number(end?.lng),
      },
      polyline,
      endName: endJibunAddress,
      routeName: routeValue,
      radiusMeters: 1000,
      endJibunAddress,
      categoryIds: [0],
    });

    reset();
  };

  const isValid = Boolean(routeValue && startJibunAddress && endJibunAddress);
  console.log(isValid);

  return (
    <div className="flex flex-col min-h-dvh">
      <PageHeader title="루트 등록" />
      <div className="my-6">
        <p className="mb-4 subtitle-b-16">루트 이름</p>
        <InputField2
          placeholder="루트 이름 입력"
          value={routeValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRouteValue(e.target.value);
            setTemp({ routeName: e.target.value });
            // uiSetTemp({ routeName: e.target.value });
            // set
          }}
        />
      </div>

      <section className="flex-1">
        {/* 인풋 */}
        <div className="mb-4">
          <p className="mb-4 subtitle-b-16">루트 설정</p>
          {/* 인풋필드 */}
          <div className="p-4 flex gap-4 bg-grey-5 rounded-xl">
            <img src={Switch} alt="출발지 도착지" />
            <div className="flex flex-col w-full">
              <div
                className="flex gap-2 border-b border-b-grey-4 pb-4 cursor-pointer"
                onClick={() => {
                  navigate("/location/search", { state: "nearbyStart" });
                }}
              >
                <img src={RDot} alt="출발지" />
                <p
                  className={`body-r-14 ${startJibunAddress ? "text-black" : "text-grey-3"}`}
                >
                  {startJibunAddress || "출발지입력"}
                </p>
              </div>
              <div
                className="flex gap-2 pt-4 cursor-pointer"
                onClick={() => {
                  navigate("/location/search", { state: "nearbyEnd" });
                }}
              >
                <img src={BDot} alt="도착지" />
                <p
                  className={`body-r-14 ${endJibunAddress ? "text-black" : "text-grey-3"}`}
                >
                  {endJibunAddress || "도착지입력"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 지도 */}

        <RouteMap
          start={start}
          end={end}
          height={260}
          onPolylineReady={setPolyline}
        />
      </section>

      <Button
        labelName="루트 등록하기"
        className="mb-8"
        onClick={handleRouteRegister}
        disabled={!isValid}
      />
    </div>
  );
}
