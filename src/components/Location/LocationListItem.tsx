import ChevronR from "@assets/icons/chevron-right.svg?react";
import { useNavigate } from "react-router-dom";

interface LocationListProps {
  roadAddress: string;
  buildingName: string;
  //   onClick: () => void;
  isSelected: boolean;
  x: number;
  y: number;
  place: string;
  address: string;
  // road: string;
  input?: string;
  // mode?: "fill-only" | "call-api";
}
export default function LocationList({
  roadAddress,
  buildingName,
  isSelected = false,
  place,
  address,
  x,
  y,
  input,
}: LocationListProps) {
  const navigate = useNavigate();

  const handleViewOnMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // navigate("/mypage/edit/location/address");
    navigate(
      `/location/map?x=${x}&y=${y}&place=${encodeURIComponent(place)}&address=${encodeURIComponent(address)}&query=${encodeURIComponent(input ?? "")}`,
      {
        state: {
          mode: "call-api",
        },
      },
    );
    console.log(`지도에서 보기 클릭: ${place}, ${address}`);
  };

  return (
    <div
      className={`px-4 py-6 rounded-lg ${isSelected ? "bg-sub1" : "bg-white"} `}
    >
      <p className="subtitle-b-16 mb-2">{buildingName}</p>
      <p className="body-r-14 text-grey-2 mb-1">{roadAddress}</p>
      <div className="flex justify-end">
        <p
          className="body-r-14 text-grey-2 mr-1 cursor-pointer"
          onClick={handleViewOnMapClick}
        >
          지도에서 보기
        </p>
        <ChevronR />
      </div>
    </div>
  );
}
