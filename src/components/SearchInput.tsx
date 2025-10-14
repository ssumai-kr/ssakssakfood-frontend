import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@/assets/icons/search-md.svg";
import Xcircle from "@/assets/icons/x-circle.svg";

interface SearchInputProps {
  className?: string;
}

export default function SearchInput({ className }: SearchInputProps) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const query = value.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`flex items-center gap-[12px] ${className} transition-all duration-200`}
    >
      <img
        src={SearchIcon}
        alt="검색"
        className="w-5 h-5 flex-shrink-0 cursor-pointer"
        onClick={handleSearch} // 🔍 아이콘 클릭 시 검색 실행
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown} // ⌨️ Enter 누르면 검색
        placeholder="식품, 매장 이름을 검색해보세요"
        className="flex-1 outline-none text-[16px] font-[400] bg-transparent"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="flex-shrink-0 focus:outline-none"
        >
          <img
            src={Xcircle}
            alt="초기화"
            className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
          />
        </button>
      )}
    </div>
  );
}
