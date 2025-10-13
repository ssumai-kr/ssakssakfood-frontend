import LocationIcon from "@assets/icons/location-icon.svg";

interface SearchLocationBtnProps {
  onClick?: () => void;
  className?: string;
}
export default function SearchLocationBtn({
  onClick,
  className = "",
}: SearchLocationBtnProps) {
  return (
    <button
      className={`w-full flex h-12  subtitle-b-16 items-center justify-center gap-2 body-rg-500 rounded-lg cursor-pointer bg-grey-5 ${className}`}
      onClick={onClick}
    >
      <img src={LocationIcon} alt="현재 위치" className="size-4" />
      현재 위치 불러오기
    </button>
  );
}
