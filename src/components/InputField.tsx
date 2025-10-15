import type { InputHTMLAttributes } from "react";
import CloseEye from "@/assets/icons/close-eye.svg";
import OpenEye from "@/assets/icons/eye.svg";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  errorMsg?: string | undefined;
  className?: string;
  onClick?: () => void;
  register?: UseFormRegisterReturn;
  disabled?: boolean;
  icon?: boolean;
  pwCheck?: boolean;
}

export default function InputField({
  register,
  placeholder = "",
  className,
  icon = false,
  pwCheck,
  onClick,
  ...props
}: InputFieldProps) {
  return (
    // <div className="text-left flex flex-col gap-2 relative  pb-5">
    <div className={` relative ${className}`}>
      <input
        type={pwCheck ? "text" : "password"}
        className={`w-full px-4 flex items-center body-r-14  py-4 border-1 rounded-xl  focus:border-main1
          border-grey-2 focus:outline-none`}
        {...(register ?? {})}
        {...props}
        placeholder={placeholder}
      />
      {icon && (
        <div className="absolute right-3 top-3.5 " onClick={onClick}>
          <img src={pwCheck ? OpenEye : CloseEye} alt="" />
        </div>
      )}
    </div>
    // </div>
  );
}
