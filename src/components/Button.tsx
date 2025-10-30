interface ButtonProps {
  labelName: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  labelName = "",
  disabled = true,
  className = "",
  onClick,
  variant = "primary",
}: ButtonProps) {
  const getVariantClasses = () => {
    if (variant === "secondary") {
      return "bg-[#F3F3F3] text-[#7F7F7F]";
    }
    return disabled
      ? "bg-grey-4 cursor-not-allowed text-white"
      : "bg-main1 text-white";
  };

  return (
    <button
      className={`w-full flex h-12 py-4 px-5.32rem rounded-lg items-center justify-center subtitle-b-16 ${getVariantClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {labelName}
    </button>
  );
}
