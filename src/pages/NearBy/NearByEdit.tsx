import InputField2 from "@/components/InputField2";
import PageHeader from "@/components/PageHeader";
import Switch from "@/assets/icons/switch.svg";
import BDot from "@/assets/icons/blue-dot.svg";
import RDot from "@/assets/icons/red-dot.svg";
import Button from "@/components/Button";
import { useNavigate, useParams } from "react-router-dom";
import RouteMap from "@/pages/NearBy/NearbyMap";
import { useDetailRoute, usePutRoute } from "@/api/nearby/nearby";
import { useEffect, useState } from "react";
import { useNearbyUiState } from "@/store/useNearbyStore";
import { LatLng } from "@/types/nearby";

export default function NearbyEdit() {
  const navigate = useNavigate();
  const parmas = useParams();
  const routeId = Number(parmas.routeId);
  const putRoute = usePutRoute(routeId);
  const isValidId = Number.isFinite(routeId);

  const { editedByRoute, setDraft } = useNearbyUiState();
  const { data } = useDetailRoute(routeId);
  console.log(data);

  const draft = isValidId ? (editedByRoute[routeId] ?? {}) : {};
  const startForMap = draft.start ?? data?.start ?? undefined;
  const endForMap = draft.end ?? data?.end ?? undefined;

  // console.log(startUi);

  // console.log(endJibunAddress, startJibunAddress);

  const [routeValue, setRouteValue] = useState(
    draft.routeName ?? data?.routeName ?? "",
  );
  const [polyline, setPolyline] = useState<LatLng[]>([]);

  //   console.log(start, startJibunAddress, end, endJibunAddress);

  useEffect(() => {
    if (!data || !isValidId) return;
    if (editedByRoute[routeId]) return;
    setDraft(routeId, {
      routeName: data.routeName,
      start: data.start,
      end: data.end,
      startJibunAddress: data.start?.jibunAddress,
      endJibunAddress: data.end?.jibunAddress,
    });
  }, [data, isValidId, routeId, editedByRoute, setDraft]);

  const handleEditRoute = () => {
    putRoute.mutate({
      routeName: routeValue,
      start: startForMap!,
      end: endForMap!,
      polyline,
    });
    navigate("/nearby");
  };

  // const isValid = Boolean(routeValue && startJibunAddress && endJibunAddress);
  const isValid = Boolean(routeValue);
  // console.log(isValid);

  return (
    <div className="flex flex-col min-h-dvh">
      <PageHeader title="루트 수정" />
      <div className="my-6">
        <p className="mb-4 subtitle-b-16">루트 이름</p>
        <InputField2
          placeholder="루트 이름 입력"
          value={routeValue || data?.routeName}
          onChange={(e) => {
            const v = e.target.value;
            setRouteValue(v);
            setDraft(routeId, { routeName: v });
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
                onClick={() =>
                  navigate("/location/search", {
                    state: { state: "nearbyStartEdit", routeId },
                  })
                }
              >
                <img src={RDot} alt="출발지" />
                <p
                  className={`body-r-14 ${draft.startJibunAddress || data?.startJibunAddress ? "text-black" : "text-grey-3"}`}
                >
                  {draft.startJibunAddress ||
                    data?.startJibunAddress ||
                    "출발지입력"}
                </p>
              </div>
              <div
                className="flex gap-2 pt-4 cursor-pointer"
                onClick={() =>
                  navigate("/location/search", {
                    state: { state: "nearbyEndEdit", routeId },
                  })
                }
              >
                <img src={BDot} alt="도착지" />
                <p
                  className={`body-r-14 ${draft.endJibunAddress || data?.endJibunAddress ? "text-black" : "text-grey-3"}`}
                >
                  {draft.endJibunAddress ||
                    data?.endJibunAddress ||
                    "도착지입력"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* 지도 */}

        <RouteMap
          start={startForMap}
          end={endForMap}
          height={260}
          onPolylineReady={setPolyline}
        />
      </section>

      <Button
        labelName="루트 수정하기"
        className="mb-8"
        onClick={handleEditRoute}
        disabled={!isValid}
      />
    </div>
  );
}
