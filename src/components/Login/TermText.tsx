import CheckFull from "@assets/icons/check-full.svg";
import CheckC from "@assets/icons/check-circle.svg";

interface TermTextProps {
  text: string;
  onClick?: () => void;
  checked?: boolean;
}

export default function TermText({
  text = "",
  onClick,
  checked,
}: TermTextProps) {
  return (
    <div className="flex pl-4 justify-between items-center self-stretch">
      <div className="flex">
        <img
          src={checked ? CheckFull : CheckC}
          alt=""
          className="pr-2"
          onClick={onClick}
        />
        <p className="body-r-16">{text}</p>
      </div>
      <img src="/icons/chevron-right.svg" alt="" />
    </div>
  );
}
