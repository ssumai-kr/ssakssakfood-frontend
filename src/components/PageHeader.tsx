import ChevronL from "@assets/icons/chevron-left.svg";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  onClick?: () => void;
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div>
      <header className="h-12 relative flex items-center self-stretch justify-center">
        <img
          src={ChevronL}
          alt="뒤로가기"
          className=" absolute left-0"
          onClick={() => navigate(-1)}
        />
        <p className="subtitle-b-18 text-center">{title}</p>
      </header>
    </div>
  );
}
