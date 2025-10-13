import ChevronL from "@assets/icons/chevron-left.svg";
import SearchLocationBtn from "../../components/Location/SearchLocationBtn";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LocationList from "../../components/Location/LocationListItem";
import Button from "../../components/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import axios from "axios";
import { postLocation } from "../../api/location/location";
import SearchIcon from "@/assets/icons/search.svg?url";

export interface Place {
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string;
  y: string;
  id: number;
}

export default function LocationSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const initialQuery = searchParams.get("query") ?? "";
  const [input, setInput] = useState(initialQuery);
  const debouncedInput = useDebounce(input, 200);

  //검색결과
  const [results, setResults] = useState<Place[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  //무한스크롤 옵저버
  const observer = useRef<IntersectionObserver | null>(null);

  const mode = location.state?.mode ?? "fill-only";

  const isFetchingRef = useRef(false);
  const fetchPlaces = useCallback(
    async (newPage = 1, isNewSearch = false) => {
      try {
        isFetchingRef.current = true;
        setIsLoading(true);

        const res = await axios.get(
          "https://dapi.kakao.com/v2/local/search/keyword.json",
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_SEARCH_KEY}`,
            },
            params: {
              query: debouncedInput,
              page: newPage,
              size: 15,
            },
          },
        );

        const newResults = res.data.documents;
        const totalCount = res.data.meta.total_count;

        setResults((prev) =>
          isNewSearch ? newResults : [...prev, ...newResults],
        );
        setHasMore(newPage * 15 < totalCount);
        setPage(newPage);

        if (isNewSearch) {
          setSelectedId(null);
        }

        console.log(newResults);
      } catch (err) {
        console.error("Error fetching places", err);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [debouncedInput],
  );

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setResults([]);
      setPage(1);
      setHasMore(false);
      return;
    }
    fetchPlaces(1, true);
  }, [debouncedInput, fetchPlaces]);

  const lastResultRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          fetchPlaces(page + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, page, fetchPlaces],
  );

  const onClickCurrent = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 사용할 수 없습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await axios.get(
          "https://dapi.kakao.com/v2/local/geo/coord2address.json",
          {
            headers: {
              Authorization: `KakaoAK ${import.meta.env.VITE_APP_KAKAO_SEARCH_KEY}`,
            },
            params: {
              x: longitude,
              y: latitude,
            },
          },
        );

        const addressInfo = res.data.documents?.[0]?.address;
        const roadAddressInfo = res.data.documents?.[0]?.road_address;

        const place = roadAddressInfo?.building_name || "현재 위치";
        const address =
          roadAddressInfo?.address_name || addressInfo.address_name || "";

        navigate(
          `/location/map?x=${longitude}&y=${latitude}&place=${encodeURIComponent(place)}&address=${encodeURIComponent(address)}&query=${encodeURIComponent(input ?? "")}`,
          {
            state: { mode: "call-api" },
          },
        );
      } catch (err) {
        console.error("주소 정보 가져오기 실패", err);
        alert("주소 정보를 불러올 수 없습니다.");
      }
    });
  };

  const handleRegister = async () => {
    if (selectedId === null) return;
    const p = results.find((item) => item.id === selectedId);
    console.log(p);
    const payload = {
      kakaoPlaceId: p?.id.toString() ?? "",
      bcode: p?.place_name ?? "",
      sido: String(p?.address_name?.split(" ")?.[0] ?? ""), //시 "만"
      sigungu: String(p?.address_name?.split(" ")?.[1] ?? ""), //구 "만"
      dong: String(p?.address_name?.split(" ")?.[2] ?? ""), //"동"
      roadAddress: p?.road_address_name ?? "",
      jibunAddress: p?.address_name ?? "", //지번
      buildingName: p?.place_name ?? "",
      longitude: Number(p?.x ?? 0),
      latitude: Number(p?.y ?? 0),
    };

    try {
      if (mode === "call-api") {
        await postLocation(payload);
        navigate("/location/edit");
      } else {
        navigate(-1);
      }
    } catch (e) {
      console.error(e);
      alert("위치 등록에 실패했습니다.");
    }
  };

  const handleSelect = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };
  return (
    <div className="w-full flex flex-col ">
      <header className="h-12 relative flex items-center self-stretch justify-center mb-8">
        <img
          src={ChevronL}
          alt="뒤로가기"
          className=" absolute left-0 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <p className="subtitle-b-18 text-center">위치관리</p>
      </header>

      <div className="flex ">
        <button className="cursor-pointer">
          <img src={SearchIcon} alt="검색" className="size-6 mr-3" />
        </button>
        <input
          type="text"
          className={`w-full rounded-xl   py-[0.625rem] px-3 focus:outline-none  placeholder:text-grey-3 `}
          placeholder="도로명 또는 지번으로 검색해보세요"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelectedId(null);
          }}
        />
      </div>
      <span className=" h-1 bg-grey-5 mb-4"></span>
      {/* 현재위치불러오기 */}
      <SearchLocationBtn className="mb-4" onClick={onClickCurrent} />
      {/* 리스트 */}
      {results.map((item, idx) => {
        const isLast = idx === results.length - 1;
        console.log(item);
        return (
          <div
            onClick={() => handleSelect(item.id)}
            ref={isLast ? lastResultRef : null}
            className="scrollbar-hide"
            key={item.id}
          >
            <LocationList
              roadAddress={item.address_name}
              buildingName={item.place_name}
              isSelected={selectedId === item.id}
              x={Number(item.x)}
              y={Number(item.y)}
              place={item.place_name ?? ""}
              address={item.address_name ?? ""}
            />
          </div>
        );
      })}
      <div
        className=" fixed  w-full max-w-[353px] flex justify-center bottom-0 pb-6  z-50 bg-white "
        // onClick={() => handleSelectLocation(results[selectedId])}
      >
        <Button
          labelName="위치등록"
          disabled={selectedId === null}
          onClick={handleRegister}
        />
      </div>
    </div>
  );
}
