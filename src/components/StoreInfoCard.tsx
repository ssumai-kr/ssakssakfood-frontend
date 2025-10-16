import chevronRight from "@/assets/images/chevron-right.png";
import { useNavigate } from "react-router-dom";

//가게 정보 카드 컴포넌트
interface StoreInfoCardProps {
  id: number; //가게 ID
  img?: string; //가게 이미지
  name?: string; //가게 이름
  address?: string; //가게 주소
}

export default function StoreInfoCard({
  id,
  img,
  name,
  address,
}: StoreInfoCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-[80px] bg-[#F3F3F3] rounded-2xl flex items-center justify-between px-3 cursor-pointer"
      onClick={() => navigate(`/store/${id}`)}
    >
      <div className="flex justify-center items-center gap-4">
        <div className="bg-white w-[56px] h-[56px] rounded-full text-[10px] flex items-center justify-center">
          {img}
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold">{name}</span>
          <span className="text-[14px] font-normal text-[#7F7F7F]">
            {address}
          </span>
        </div>
      </div>
      <img src={chevronRight} alt="자세히보기" />
    </div>
  );
}
