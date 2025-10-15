import { useNavigate } from "react-router-dom";
import { LocationField } from "../../components/Location/LocationField";
import SearchLocationBtn from "../../components/Location/SearchLocationBtn";
import Location from "../../components/Location/Location";
import { useState } from "react";
import {
  useGetMyLocation,
  useGetMyPrimaryLocation,
  usePatchLocation,
} from "../../api/location/location";
import type { myLocationResponseDto } from "../../types/location";
import PageHeader from "@/components/PageHeader";

export default function LocationEdit() {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState<boolean>(true);

  const handleClick = () => {
    navigate("/location/search", { state: { mode: "call-api" } });
  };

  const {
    data: myLocationData,
    isLoading: isLoading,
    isError: isError,
  } = useGetMyLocation();
  // console.log(myLocationData);

  const {
    data: primaryData,
    isLoading: LocationData,
    isError: LocationError,
  } = useGetMyPrimaryLocation();
  console.log(primaryData, "프라이머리");

  const patchLocation = usePatchLocation();
  const handlePatchLocation = (id: number) => {
    console.log("안녕");
    patchLocation.mutate(id);
  };
  console.log(myLocationData, "겟");

  const notPrimary = myLocationData?.filter(
    (item: myLocationResponseDto) => !item.isPrimary,
  );
  console.log(notPrimary, "p아닌거");

  if (isLoading || LocationData) {
    return <div>로딩중</div>;
  }

  if (isError || LocationError) {
    return <p className="body-rg-500">오류 발생</p>;
  }
  const fullLocation = myLocationData?.length === 5;
  return (
    <div className="w-full flex flex-col mb-8">
      <PageHeader title="위치 관리" />
      <div
        onClick={handleClick}
        onClickCapture={(e) => {
          if (fullLocation) {
            e.stopPropagation();
            alert("주소지는 최대 5개만 등록 가능합니다");
          }
        }}
      >
        <LocationField mode={fullLocation ? "fill-only" : "call-api"} />
        <div className=" h-1 bg-grey-5 mb-4"></div>
        <SearchLocationBtn className="mb-6" />
      </div>
      <section className=" flex flex-col">
        <div className="flex flex-col gap-4 ">
          <p className="subtitle-b-16">선택된 위치</p>
          <div className="bg-sub1 body-r-16 rounded-lg p-4 mb-6">
            <>
              <p className="subtitle-b-16 mb-2">{primaryData?.buildingName}</p>
              <p className="body-r-14 text-grey-2">
                {primaryData?.jibunAddress}
              </p>
            </>
          </div>
        </div>
        <div className="flex  items-center mb-4">
          <p className="subtitle-b-16 mr-auto">등록된 위치</p>
          <button
            className="py-1 px-3 rounded-s-sm bg-grey-5 body-r-14"
            onClick={() => setIsEdit((pre) => !pre)}
          >
            {isEdit ? "수정" : "저장"}
          </button>
        </div>
        {notPrimary?.map((item: myLocationResponseDto) => {
          const responseBulidingName =
            item?.buildingName === null ? "현재 위치" : item?.buildingName;
          return (
            <Location
              key={item.userLocationId}
              jibunAddress={item.jibunAddress}
              buildingName={responseBulidingName}
              editMode={!isEdit}
              userLocationId={Number(item?.userLocationId)}
              onClick={() => {
                handlePatchLocation(item.userLocationId);
              }}
            />
          );
        })}
      </section>
    </div>
  );
}
