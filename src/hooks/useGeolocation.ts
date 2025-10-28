import { useEffect, useState } from "react";

interface GeoLocationResult {
  latitude: number;
  longitude: number;
  address: string | null; // 동만
  fullAdress: string | null; // 시/구/동까지
  loading: boolean;
  error: string | null;
}

interface CachedGeoLocation {
  latitude: number;
  longitude: number;
  address: string | null;
  fullAdress: string | null;
}

const GEOLOCATION_CACHE_KEY = "cached_geolocation";

const useGeolocation = (): GeoLocationResult => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [address, setAddress] = useState<string | null>(null);
  const [fullAdress, setFullAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. 먼저 sessionStorage에서 캐시된 데이터 확인
    const cachedData = sessionStorage.getItem(GEOLOCATION_CACHE_KEY);
    if (cachedData) {
      try {
        const parsed: CachedGeoLocation = JSON.parse(cachedData);
        setLatitude(parsed.latitude);
        setLongitude(parsed.longitude);
        setAddress(parsed.address);
        setFullAddress(parsed.fullAdress);
        setLoading(false);
        console.log("✅ 캐시된 위치 정보 사용");
        return;
      } catch (err) {
        console.log("캐시 파싱 실패, 새로운 위치 정보를 가져옵니다.", err);
      }
    }

    // 2. 캐시된 데이터가 없으면 새로 가져오기
    if (!navigator.geolocation) {
      setError("이 브라우저는 위치 정보를 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    console.log("새로운 위치 정보를 가져오는 중...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);

        try {
          const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`;
          const headers = {
            Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
          };

          const response = await fetch(url, { method: "GET", headers });
          if (!response.ok) {
            throw new Error("주소 정보를 가져오지 못했습니다.");
          }

          const data = await response.json();
          const fullAddrRaw = data.documents?.[0]?.address?.address_name; // 전체 주소

          let addressValue: string | null = null;
          let fullAddressValue: string | null = null;

          if (fullAddrRaw) {
            const parts = fullAddrRaw.split(" ");
            const dongPart = parts.slice(0, 3).join(" "); // 시/구/동까지
            fullAddressValue = dongPart;
            addressValue = parts[2]; // 동만
            setFullAddress(dongPart);
            setAddress(parts[2]);
          } else {
            setFullAddress(null);
            setAddress(null);
          }

          // 3. sessionStorage에 캐시 저장
          const cacheData: CachedGeoLocation = {
            latitude,
            longitude,
            address: addressValue,
            fullAdress: fullAddressValue,
          };
          sessionStorage.setItem(
            GEOLOCATION_CACHE_KEY,
            JSON.stringify(cacheData),
          );
          console.log("위치 정보 캐시 저장 완료");
        } catch (err) {
          setError("주소 변환 중 오류가 발생했습니다.");
          console.log(err);
        }

        setLoading(false);
      },
      (err) => {
        setError("위치 정보를 가져오는 데 실패했습니다.");
        setLoading(false);
        console.log(err);
      },
    );
  }, []);

  return { latitude, longitude, address, fullAdress, loading, error };
};

export default useGeolocation;
