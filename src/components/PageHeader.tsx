import ChevronL from "@assets/icons/chevron-left.svg";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  onClick?: () => void;
  title: string;
  fallbackPath?: string; // 뒤로갈 곳이 없을 때 이동할 경로
}

export default function PageHeader({
  title,
  fallbackPath = "/",
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };

  return (
    <div>
      <header className="h-12 relative flex items-center self-stretch justify-center">
        <img
          src={ChevronL}
          alt="뒤로가기"
          className="absolute left-0 cursor-pointer"
          onClick={handleBack}
        />
        <p className="subtitle-b-18 text-center">{title}</p>
      </header>
    </div>
  );
}
