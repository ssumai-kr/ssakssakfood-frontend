//Header Components
import locatoinImg from "@/assets/icons/location.svg";
import chevronDownImg from "@/assets/icons/chevron-down.svg";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title?: string;
}

interface LocationHeaderProps {
  location?: string | null;
}

//Title 내용을 Props로 받아 화면에 따른 메뉴의 Header내용을 보여줍니다.
export function MenuHeader({ title }: HeaderProps) {
  const navigate = useNavigate();
  return (
    <header>
      <div className='flex items-center justify-center py-4 border-gray-200 bg-white sticky top-0 z-10"'>
        <img
          src="/icons/chevron-left.svg"
          alt="뒤로가기"
          className=" absolute left-0 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <div className="text-[18px] font-bold">{title}</div>
      </div>
    </header>
  );
}

//홈 화면에서 현재 위치 or 설정 위치를 보여주는 Header
export function LocationHeader({ location }: LocationHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="">
      <div className="flex items-center gap-[8px] py-4 px-[16px]">
        <img src={locatoinImg} alt="위치" />
        <div className="text-[16px] font-bold">{location}</div>
        <img
          src={chevronDownImg}
          alt="지역 설정"
          className="ml-auto cursor-pointer"
          onClick={() => navigate("/location/search")}
        />
      </div>
    </header>
  );
}
