import mockImg from "@/assets/icons/bread.svg";
import basicImage from "@/assets/images/basic.svg";
import StockBadge from "./StockBadge";
import { useNavigate } from "react-router-dom";
import closeImg from "@/assets/icons/x-circle.svg";
import { formatDeadline } from "@/utils/dateFormatter";
interface MenuCardProps {
  id: number;
  title: string;
  storeName: string;
  pickupTime: string;
  originalPrice: number;
  salePrice: number;
  discountRate: number;
  stockCount: number;
  imageUrl?: string;
  isShared?: boolean;
}

//일반 홈 화면에서 보이는 메뉴 카드 컴포넌트입니다.
export default function MenuCard({
  id,
  title,
  storeName,
  pickupTime,
  originalPrice,
  salePrice,
  discountRate,
  stockCount,
  imageUrl,
  isShared = false,
}: MenuCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/menu/${id}`);
  };

  return (
    <div
      className="flex gap-[18px] items-center cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-[108px] h-[108px] flex-shrink-0">
        <img
          src={imageUrl || basicImage}
          alt={title}
          className="w-full h-full object-cover rounded-[8px]"
        />
        <div className="absolute top-[8px] left-[8px]">
          <StockBadge count={stockCount} />
        </div>
      </div>
      <div className="w-full">
        <div>
          <div className="flex items-center gap-[10px]">
            <span className="text-[16px] font-bold">{title}</span>
            <span className="text-[13px] font-[600] text-[#7F7F7F]">
              {storeName}
            </span>
          </div>
          <div className="flex gap-[10px] text-[13px] font-[600] text-[#7F7F7F]">
            픽업 가능시간
            <span>{formatDeadline(pickupTime)}</span>
          </div>
          {isShared ? (
            <div className="text-[13px] font-semibold text-[#496FF8] bg-[#EDF1FF] w-fit px-0.5 mt-[2px]">
              급식카드 소지자 무료 식품
            </div>
          ) : (
            <div className="h-[21px] mt-[2px]" />
          )}
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
              <div className="text-[18px] font-bold">
                <span>{salePrice.toLocaleString()}</span>원
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//사장님 홈 화면에서 보이는 메뉴 이미지 카드 컴포넌트입니다.
export function MenuImgCard({
  originalPrice,
  salePrice,
  name,
}: {
  originalPrice: number;
  salePrice: number;
  name: string;
}) {
  return (
    <div className="relative w-[128px] h-[128px] flex-shrink-0">
      <img
        src={mockImg}
        alt="임시"
        className="w-full h-full object-cover rounded-[8px]"
      />
      <div
        className="absolute inset-0 rounded-[8px] z-10 
                   bg-gradient-to-t from-black/60 via-black/0 to-transparent"
      ></div>
      <div className="absolute left-[10px] bottom-[30px] text-[16px] text-white font-bold z-20">
        {name}
      </div>
      <div className="flex items-center  gap-2 absolute left-[10px] bottom-[12px] text-white z-20">
        <div className="line-through text-[12px]">
          {originalPrice.toLocaleString()}원
        </div>
        <div className="font-bold text-[14px]">
          {salePrice.toLocaleString()}원
        </div>
      </div>
      <div className="absolute top-[8px] left-[8px]"></div>
    </div>
  );
}

export function MenuAddCard({
  id,
  name,
  originalPrice,
  salePrice,
  isEditMode,
  onDelete,
  onStartSale,
}: {
  id: number;
  name: string;
  originalPrice: number;
  salePrice: number;
  isEditMode?: boolean;
  onDelete?: () => void;
  onStartSale?: (id: number) => void;
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!isEditMode) {
      navigate(`/addfood/${id}`);
    }
  };

  return (
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4 items-center">
        <img src={mockImg} alt="식품 추가 아이콘" width={80} />
        <div className="flex flex-col gap-2">
          <div className="text-[18px] font-bold">{name}</div>
          <div className="flex flex-col text-[14px] font-normal text-[#7F7F7F]">
            <div>
              원가{" "}
              <span className="font-semibold">
                {originalPrice.toLocaleString()}원
              </span>
            </div>
            <div>
              판매가{" "}
              <span className="font-semibold">
                {salePrice.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      </div>
      {isEditMode ? (
        <div
          className="w-[30px] h-[30px] flex items-center justify-center rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
        >
          <img src={closeImg} alt="삭제" />
        </div>
      ) : (
        <div
          className="w-[74px] h-[30px] text-white text-[14px] font-semibold flex rounded-lg items-center justify-center bg-main1 px-[11px] py-[7px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onStartSale?.(id);
          }}
        >
          판매 시작
        </div>
      )}
    </div>
  );
}

//(사장님) 오늘의 판매 식품 리스트에 보이는 메뉴 카드 컴포넌트입니다.
export function MenuTodayCard({
  name,
  originalPrice,
  salePrice,
  dueDate,
  stockCount,
  isShare,
  isSoldOut,
}: {
  name: string;
  originalPrice: number;
  salePrice: number;
  dueDate: string;
  stockCount: number;
  isShare?: boolean;
  isSoldOut?: boolean;
}) {
  return (
    <div className="flex gap-[12px] items-center">
      {/* 이미지 영역 */}
      <div className="relative w-[114px] h-[114px] flex-shrink-0">
        <img src={mockImg} alt="임시" className="w-full h-full rounded-[8px]" />
        {isSoldOut && (
          <div className="absolute inset-0 bg-black opacity-50 rounded-[8px]" />
        )}
        <div className="absolute top-[8px] left-[8px]">
          <StockBadge count={stockCount} isSoldOut={isSoldOut} />
        </div>
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        {/* 상단: 이름과 마감기한 */}
        <div className="flex flex-col gap-[2px]">
          <span className="text-[18px] font-bold truncate">{name}</span>
          <div className="text-[14px] text-[#7F7F7F]">
            마감기한 <span>{formatDeadline(dueDate)}</span>
          </div>
        </div>

        {/* 중간: 급식카드 배지 */}
        {isShare ? (
          <div className="text-[14px] font-semibold text-[#496FF8] bg-[#EDF1FF] w-fit px-0.5 mt-[2px]">
            급식카드 소지자 무료 식품
          </div>
        ) : (
          <div className="h-[21px]" />
        )}

        {/* 하단: 가격 */}
        <div className="flex flex-col items-end">
          <span className="text-[14px] font-semibold text-[#7F7F7F] line-through">
            {originalPrice.toLocaleString()}원
          </span>
          <span className="text-[18px] font-bold">
            {salePrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
}
