import type { InputHTMLAttributes } from "react";
import type { FieldValues, UseFormRegister } from "react-hook-form";
import CloseEye from "@/assets/icons/close-eye.svg";
interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  errorMsg?: string | undefined;
  className?: string;
  onClick?: () => void;
  register?: UseFormRegister<FieldValues>;
  disabled?: boolean;
  icon?: boolean;
  imgSrc?: string;
}

export default function InputField({
  register,
  placeholder = "",
  className,
  icon = false,
  ...props
}: InputFieldProps) {
  return (
    // <div className="text-left flex flex-col gap-2 relative  pb-5">
    <div className={` relative ${className}`}>
      <input
        type="text"
        className={`w-full px-4 flex items-center body-r-14  py-4 border-1 rounded-xl  focus:border-main1
          border-grey-2 focus:outline-none`}
        {...register}
        {...props}
        placeholder={placeholder}
      />
      {icon && (
        <div className="absolute right-3 top-4 ">
          <img src={CloseEye} alt="" />
        </div>
      )}
    </div>
    // </div>
  );
}
