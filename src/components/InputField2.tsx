import type { InputHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import CloseEye from "@/assets/icons/close-eye.svg";
import OpenEye from "@/assets/icons/eye.svg";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  errorMsg?: string | undefined;
  className?: string;
  onClick?: () => void;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  icon?: boolean;
  // imgSrc?: string;
  type?: string;
  showPwd?: boolean;
  inputClassName?: string;
  inputText?: string;
}

export default function InputField2({
  register,
  placeholder = "",
  className,
  errorMsg,
  type = "text",
  icon = false,
  // imgSrc = "",
  showPwd,
  onClick,
  inputClassName,
  inputText,
  ...props
}: InputFieldProps) {
  return (
    // <div className="text-left flex flex-col gap-2 relative  pb-5">
    <div className={`relative ${className}`}>
      <input
        type={type}
        className={`w-full px-4 flex body-r-14 items-center py-4 border-1 rounded-xl  focus:border-main1
          bg-grey-5 border-grey-5 focus:outline-none ${inputClassName}`}
        {...(register ?? {})}
        {...props}
        placeholder={placeholder}
      />
      {errorMsg && <p className="body-r-14 text-main2">{errorMsg}</p>}
      {icon && (
        <div className="absolute right-3 top-3.5">
          <img src={showPwd ? OpenEye : CloseEye} alt="" onClick={onClick} />
        </div>
      )}
      <div className="absolute right-4 top-2.5 text-[16px] font-semibold">
        {inputText}
      </div>
    </div>
    // </div>
  );
}
