//내 주변 페이지
import useGeolocation from "@/hooks/useGeolocation";
import Route from "@assets/icons/tabler_route.svg";
import Close from "@assets/icons/x-close-black.svg";
import { useCallback, useEffect, useRef, useState } from "react";
import Marker from "@/assets/icons/map-marker.svg?url";
import SearchInput from "@/components/SearchInput";
import RoutesModal from "@/components/nearby/RoutesModal";
import { useAlongRoute, useGetNearby } from "@/api/nearby/nearby";
import NearMarker from "@/assets/icons/marker.svg?url";
import { LatLng, NearbyResponseDto } from "@/types/nearby";
import RouteMap from "@/pages/NearBy/NearbyMap";
import FooterNav from "@/layout/FooterNav";
import NearbyStorePage from "@/pages/NearBy/nearbyStore";
import { useGetMyPrimaryLocation } from "@/api/location/location";
import { isLoggedIn } from "@/utils/getUserInfo";

// import MenuCard from "@/components/MenuCard";
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}
export default function NearbyPage() {
  const loggedIn = isLoggedIn();

  const { data: primaryLocation } = useGetMyPrimaryLocation(loggedIn);
  console.log(primaryLocation);
  useEffect(() => {
    if (loggedIn && primaryLocation) {
      const cacheData = {
        latitude: primaryLocation.latitude,
        longitude: primaryLocation.longitude,
        address: primaryLocation.jibunAddress || null,
        fullAdress: primaryLocation.roadAddress || null,
      };
      sessionStorage.setItem("cached_geolocation", JSON.stringify(cacheData));
    }
  }, [loggedIn, primaryLocation]);

  const { latitude, longitude, loading, error } = useGeolocation();
  console.log(latitude, longitude, "위치치치치");
  const getNearbyAlong = useAlongRoute();

  const [ismodal, setIsModal] = useState(false);
  // const [storeModal, setStoreModal] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | undefined>(
    undefined,
  );

  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeMarkersRef = useRef<any[]>([]);
  const clearStoreMarkers = () => {
    storeMarkersRef.current.forEach((m) => m.setMap(null));
    storeMarkersRef.current = [];
  };

  const [selectedRoute, setSelectedRoute] = useState<NearbyResponseDto | null>(
    null,
  );

  //출발지,목적지 상태

  // console.log(selectedRoute);

  // const { data: storeData } = useStoreMenus(selectedMarker);
  // console.log(storeData);

  console.log(selectedMarker);
  const renderStoreMarkers = (
    markers: Array<{
      storeId: number;
      lat: number;
      lng: number;
      storeName?: string;
      distanceMeters?: number;
    }>,
  ) => {
    const kakao = window.kakao;
    if (!mapInstanceRef.current || !kakao) return;

    clearStoreMarkers();
    const imageSize = new kakao.maps.Size(30, 30);
    const imageOffset = new kakao.maps.Point(16, 32);
    const nearMarkerImage = new kakao.maps.MarkerImage(NearMarker, imageSize, {
      offset: imageOffset,
    });
    markers.forEach((s) => {
      const mk = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(s.lat, s.lng),
        map: mapInstanceRef.current,
        image: nearMarkerImage,
      });

      kakao.maps.event.addListener(mk, "click", () => {
        setSelectedMarker(s.storeId);
      });

      storeMarkersRef.current.push(mk);
    });
  };

  useEffect(() => {
    const kakao = window.kakao;
    if (loading || error) return;
    if (!mapRef.current || !kakao || !latitude || !longitude) return;

    kakao.maps.load(() => {
      const centerPos = new kakao.maps.LatLng(latitude, longitude);
      const mapOption = {
        center: centerPos,
        level: 3,
        draggable: true,
        scrollwheel: true,
      };

      const map = new kakao.maps.Map(mapRef.current, mapOption);
      mapInstanceRef.current = map;
      kakao.maps.event.addListener(map, "click", () => {
        setSelectedMarker(undefined);
      });

      // 내 위치 마커
      new kakao.maps.Marker({
        position: centerPos,
        map,
        image: new kakao.maps.MarkerImage(Marker, new kakao.maps.Size(40, 40), {
          offset: new kakao.maps.Point(20, 20),
        }),
      });

      if (!selectedRoute) {
        getNearbyAlong.mutate(
          {
            polyline: [
              { lat: latitude, lng: longitude },
              { lat: latitude, lng: longitude },
            ],
            radiusMeters: 2000,
            category: [0],
          },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSuccess: (res: any) => {
              console.log(res, "근처경로조회");
              renderStoreMarkers(res?.markers ?? []);
            },
          },
        );
      }
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, error, latitude, longitude, selectedRoute]);
  const { data } = useGetNearby();
  // console.log(data);

  // const handleMapReady = (map: any) => {
  //   mapInstanceRef.current = map;
  // };

  const handleModal = () => {
    setIsModal(true);
  };
  const onCloseModal = () => {
    setIsModal(false);
  };

  //루트 주변 경로 가져오기 ...
  const handleGetRoute = (item: NearbyResponseDto) => {
    setSelectedRoute(item);
    setIsModal(false);
  };
  const handlePolylineReady = useCallback((polyline: LatLng[]) => {
    if (!polyline?.length) return;
    clearStoreMarkers();
    getNearbyAlong.mutate(
      { polyline, radiusMeters: 2000, category: [0] },
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSuccess: (res: any) => {
          console.log("근처경로조회,루트임");
          renderStoreMarkers(res?.markers ?? []);
        },
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showRoute = !!selectedRoute;
  console.log(typeof selectedMarker);

  const isStoreOpen = selectedMarker !== undefined;

  return (
    <div className="relative h-dvh -mx-6">
      <div ref={mapRef} className="absolute inset-0 z-10" />

      {showRoute && (
        <div className="absolute inset-0 z-20">
          <RouteMap
            start={selectedRoute?.start}
            end={selectedRoute?.end}
            height="100%"
            onMapReady={(map) => {
              mapInstanceRef.current = map;
              window.kakao.maps.event.addListener(map, "click", () => {
                setSelectedMarker(undefined);
              });
            }}
            onPolylineReady={handlePolylineReady}
          />
        </div>
      )}
      {/* 상단 UI는 공통으로 */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-[30]">
        <div className="mt-5 px-6 pointer-events-auto">
          <SearchInput className="relative bg-white px-4 py-[10px] rounded-3xl w-full mb-2" />
        </div>

        <div className="flex px-6">
          <div
            className="mr-2 flex rounded-4xl h-6  py-1 px-3 gap-2 pointer-events-auto shrink-0"
            style={{ background: "var(--color-gradient-main1)" }}
            onClick={handleModal}
          >
            <img src={Route} alt="루트" />
            <p className="body-r-14 text-white">내 루트</p>
          </div>

          {selectedRoute && (
            <div className=" flex rounded-4xl h-6 w-fit py-1 pl-3 pr-2 gap-2 bg-white items-center shadow-main1 pointer-events-auto">
              <p className="text-black text-sm">{selectedRoute.routeName}</p>
              <img
                src={Close}
                onClick={() => setSelectedRoute(null)}
                className="w-4 h-4 cursor-pointer"
                alt="닫기"
              />
            </div>
          )}
        </div>
      </div>

      {ismodal && (
        <RoutesModal
          onCloseModal={onCloseModal}
          data={data}
          onSelectItem={handleGetRoute}
        />
      )}

      {isStoreOpen && <NearbyStorePage id={selectedMarker} />}

      <footer className="fixed bottom-0 w-full max-w-[401px] bg-white border-t border-gray-100 z-10 mx-auto">
        <FooterNav />
      </footer>
    </div>
  );
}
