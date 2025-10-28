import { useEffect, useRef, useState } from "react";
import axios from "axios";
import SMarkerUrl from "@/assets/icons/start-marker.svg?url";
import EMarkerUrl from "@/assets/icons/end-marker.svg?url";

type LatLng = { lat: number; lng: number };

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

interface NearbyMapProps {
  start?: LatLng;
  end?: LatLng;
  height?: number | string;
  /** 보행 거리/시간을 필요하면 여기로 알려줌  */
  //   onSummary?: (summary: { distance: number; time: number }) => void;

  onPolylineReady?: (polyline: LatLng[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapReady?: (map: any) => void;
}

export default function RouteMap({
  start,
  end,
  height = 260,
  //   onSummary,
  onMapReady,
  onPolylineReady,
}: NearbyMapProps) {
  const mapEl = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const polylineRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  // Kakao 지도 인스턴스 생성
  useEffect(() => {
    let timer: number | null = null;

    const ensureKakaoReady = () =>
      new Promise<void>((resolve) => {
        const check = () => {
          if (window.kakao && window.kakao.maps) return resolve();
          timer = window.setTimeout(check, 50);
        };
        check();
      });

    ensureKakaoReady().then(() => {
      if (!mapEl.current) return;
      const { kakao } = window;

      const init = () => {
        const center = start || end || { lat: 37.5665, lng: 126.978 };
        mapRef.current = new kakao.maps.Map(mapEl.current!, {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 6,
        });
        setIsMapReady(true);
        onMapReady?.(mapRef.current); //부모한테 지도
      };

      if (kakao.maps.load) kakao.maps.load(init);
      else init();
    });

    return () => {
      if (timer) clearTimeout(timer);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 경로 그리기

  useEffect(() => {
    const map = mapRef.current;
    if (!isMapReady) return;
    if (!map || !start || !end) return;

    const { kakao } = window;

    // 이전 오버레이/마커 정리
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const sPos = new kakao.maps.LatLng(start.lat, start.lng);
    const ePos = new kakao.maps.LatLng(end.lat, end.lng);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const makeMarker = (position: any, url?: string) => {
      try {
        if (url) {
          const image = new kakao.maps.MarkerImage(
            url,
            new kakao.maps.Size(40, 40),
            { offset: new kakao.maps.Point(20, 20) },
          );
          return new kakao.maps.Marker({ map, position, image });
        }
        return new kakao.maps.Marker({ map, position });
      } catch {
        return new kakao.maps.Marker({ map, position });
      }
    };

    const sMarker = makeMarker(sPos, SMarkerUrl);
    const eMarker = makeMarker(ePos, EMarkerUrl);
    markersRef.current = [sMarker, eMarker];

    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(sPos);
    bounds.extend(ePos);

    const fetchWalkRoute = async (signal?: AbortSignal) => {
      const appKey = import.meta.env.VITE_APP_TMAP_KEY as string | undefined;

      const url =
        "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json";
      const body = {
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
        startX: Number(start.lng),
        startY: Number(start.lat),
        endX: Number(end.lng),
        endY: Number(end.lat),
        startName: "출발지",
        endName: "도착지",
      };

      const { data } = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          appKey: appKey ?? "",
        },
        signal,
      });

      console.log("[RouteMap] Tmap response:", data);
      const features = data?.features ?? [];
      let totalDistance = 0;
      let totalTime = 0;
      for (const f of features) {
        const p = f?.properties;
        if (p?.totalDistance != null) totalDistance = p.totalDistance;
        if (p?.totalTime != null) totalTime = p.totalTime;
      }

      const lineCoords: Array<{ lat: number; lng: number }> = [];
      features // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((f: any) => f.geometry?.type === "LineString") // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .forEach((f: any) => {
          (f.geometry.coordinates || []).forEach((c: [number, number]) => {
            lineCoords.push({ lng: c[0], lat: c[1] });
          });
        });

      return { lineCoords, totalDistance, totalTime };
    };

    const ac = new AbortController();

    (async () => {
      try {
        const { lineCoords } = await fetchWalkRoute(ac.signal);
        // onSummary?.({ distance: totalDistance, time: totalTime });
        const rounded = lineCoords.map((p) => ({
          lat: +p.lat.toFixed(6),
          lng: +p.lng.toFixed(6),
        }));
        onPolylineReady?.(rounded);
        const path =
          lineCoords.length > 1
            ? lineCoords.map((p) => new kakao.maps.LatLng(p.lat, p.lng))
            : [sPos, ePos]; // 폴백

        path.forEach((ll) => bounds.extend(ll));
        map.setBounds(bounds, 40);

        polylineRef.current = new kakao.maps.Polyline({
          map,
          path,
          strokeWeight: 6,
          strokeColor: "#FF6B00",
          strokeOpacity: 1,
          strokeStyle: "solid",
        }); // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e?.name === "CanceledError" || e?.message === "canceled") return;
        polylineRef.current = new kakao.maps.Polyline({
          map,
          path: [sPos, ePos],
          strokeWeight: 6,
          strokeColor: "#FF6B00",
        });
        map.setBounds(bounds, 40);
        console.error("Tmap Pedestrian API error:", e);
      }
    })();

    return () => {
      ac.abort();
    };

    // [isMapReady, start.lng,start.lat, end.lng,end.lat, onPolylineReady]
  }, [isMapReady, start, end, onPolylineReady]);

  const styleHeight =
    typeof height === "number" ? `${height}px` : height || "260px";

  return (
    <div
      ref={mapEl}
      style={{
        width: "100%",
        height: styleHeight,
        minHeight: "200px",
        position: "relative",
      }}
    />
  );
}
