import StockBadge from "@/components/StockBadge";
import { useNavigate } from "react-router-dom";
import mockImg from "@/assets/images/logo.png";
interface MenuCardProps {
  id: number;
  title: string;
  storeName: string;
  pickupTime: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  stockCount: number;
  imgUrl: string;
}

export default function NearMenuCard({
  id,
  title,
  storeName,
  pickupTime,
  originalPrice,
  salePrice,
  discountRate,
  stockCount,
  imgUrl,
}: MenuCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/menu/${id}`);
  };

  return (
    <div className="flex gap-[18px] cursor-pointerw-full" onClick={handleClick}>
      <div className="relative w-[100px] h-[100px] flex-shrink-0 ">
        <img
          src={imgUrl || mockImg}
          alt="임시"
          className="w-full h-full object-cover rounded-[8px]"
        />
        <div className="absolute top-[8px] left-[8px]">
          <StockBadge count={stockCount} />
        </div>
      </div>
      <div className="w-full">
        <div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[18px] font-bold">{title}</span>
            <span className="text-[14px] font-[600] text-[#7F7F7F]">
              {storeName}
            </span>
          </div>
          <div className="flex gap-[10px] text-[14px] font-[600] text-[#7F7F7F]">
            픽업 가능시간
            <span>{pickupTime}</span>
          </div>
        </div>
        <div className="flex justify-end w-full">
          <div className="flex flex-col">
            <div className="flex justify-end text-[14px] text-[#A8A8A8] line-through">
              <span>{originalPrice.toLocaleString()}</span>원
            </div>
            <div className="flex gap-[10px] items-center justify-end">
              <div className="text-[16px] font-semibold text-[#F30000]">
                <span>{discountRate}</span>%
              </div>
              <div className="text-[20px] font-bold">
                <span>{salePrice.toLocaleString()}</span>원
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
