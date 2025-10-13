import type { UseFormRegisterReturn } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "@/assets/icons/search.svg?url";
import { useNavigate } from "react-router-dom";

interface LocationFieldProps {
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  returnPath?: string;
  onClick?: () => void;
  mode?: "fill-only" | "call-api";
}

export const LocationField = ({
  register,
  mode = "call-api",
  // returnPath,
  // onClick,
}: LocationFieldProps) => {
  const navigate = useNavigate();
  // const location = useLocation();
  const isTrigger = mode === "call-api"; //이동
  const handleClick = () => {
    if (isTrigger) {
      navigate("/location/search", { state: { mode } });
    }
  };

  return (
    <>
      <div className="text-left ">
        <div className="flex ">
          <button className="cursor-pointer">
            <img src={SearchIcon} alt="검색" className="size-6 mr-3" />
          </button>
          <input
            type="text"
            className={`w-full rounded-xl   py-[0.625rem] px-3 focus:outline-none ${isTrigger ? "cursor-pointer" : ""} placeholder:text-grey-3 `}
            placeholder="도로명 또는 지번으로 검색해보세요"
            {...register}
            readOnly={isTrigger}
            autoFocus={!isTrigger}
            onClick={isTrigger ? handleClick : undefined}
          />
        </div>
      </div>
    </>
  );
};
