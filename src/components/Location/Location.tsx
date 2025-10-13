import Dismiss from "@assets/icons/x-circle.svg?react";
import { useDeleteLocation } from "../../api/location/location";

interface LocationProps {
  editMode?: boolean;
  onClick?: () => void;
  jibunAddress: string;
  buildingName: string;
  userLocationId: number;
}

export default function Location({
  editMode = false,
  jibunAddress = "",
  buildingName = "",
  userLocationId,
  onClick,
}: LocationProps) {
  const deleteLocation = useDeleteLocation();
  const locationDelete = () => {
    deleteLocation.mutate(userLocationId);
  };

  return (
    <div
      className=" p-4 flex items-center rounded-lg border border-grey-4 justify-between"
      onClick={() => {
        if (editMode) return;
        onClick?.();
      }}
    >
      <div className="body-r-16">
        <p className="subtitle-b-16 mb-2">{buildingName}</p>
        <p className="body-r-14 text-grey-2">{jibunAddress}</p>
      </div>
      {editMode && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            locationDelete();
          }}
        >
          <Dismiss />
        </div>
      )}
    </div>
  );
}
