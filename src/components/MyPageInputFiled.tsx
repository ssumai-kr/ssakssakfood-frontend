import { type InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

import CornorArrow from "@/assets/icons/corner-down-right.svg";
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  errorMsg?: string | undefined;
  className?: string;
  openEye?: () => void;
  onChangeClick?: () => void;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  icon?: boolean;
  // imgSrc?: string;
  type?: string;
  showPwd?: boolean;
  inputClassName?: string;
  inputText?: string;
  labelName?: string;
  isChange?: boolean;
  //   changePlaceholder?: string;
  onChangeUser?: () => void;
}

export default function MyPageInputField({
  register,
  placeholder = "",
  className,
  //   errorMsg,
  type = "text",
  //   icon = false,
  // imgSrc = "",
  // showPwd,
  // openEye,
  onChangeClick,
  inputClassName,
  isChange,
  labelName,
  onChangeUser,
  //   changePlaceholder,
  ...props
}: InputFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <p className="mb-4 subtitle-b-16">{labelName}</p>
      <div className="relative">
        <input
          type={type}
          className={`w-full px-4 flex body-r-14 items-center py-4 border-1 rounded-xl  focus:border-main1
          bg-grey-5 border-grey-5 focus:outline-none ${inputClassName}`}
          {...(register ?? {})}
          placeholder={placeholder}
          disabled
        />
        <p
          className={`absolute top-4 right-4  subtitle-b-16 cursor-pointer ${!isChange ? "text-main1" : "text-[#7F7F7F]"}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.stopPropagation();
            onChangeClick?.();
          }}
        >
          {!isChange ? "변경" : "변경 취소"}
        </p>
      </div>
      {isChange && (
        <div className="flex">
          <img src={CornorArrow} alt="" className="mr-5" />
          <div className="w-full">
            <p className="my-4 subtitle-b-16">변경할 {labelName}</p>
            <div className="relative w-full">
              <input
                type={type}
                className={`w-full pl-4 pr-20 flex body-r-14 items-center py-4 border-1 rounded-xl  focus:border-main1
          bg-grey-5 border-grey-5 focus:outline-none ${inputClassName}`}
                {...(register ?? {})}
                {...props}
                placeholder={`변경할 ${labelName} 입력`}
              />
              <p
                className="absolute top-4 right-4 text-main1 subtitle-b-16 cursor-pointer"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeUser?.();
                }}
              >
                변경완료
              </p>
            </div>
          </div>
        </div>
      )}
      {/* {errorMsg && <p className="body-r-14 text-main2">{errorMsg}</p>} */}
      {/* {icon && (
        <div className="absolute right-3 top-3.5">
          <img src={showPwd ? OpenEye : CloseEye} alt="" onClick={openEye} />
        </div>
      )} */}
    </div>
  );
}
