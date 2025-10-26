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
        onClick={handleSearch}
      />
      <div className="flex-1 relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="식품, 매장 이름을 검색해보세요"
          className={`w-full outline-none text-[16px] font-[400] bg-transparent ${
            value ? "pr-7" : ""
          }`}
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-0 focus:outline-none"
          >
            <img
              src={Xcircle}
              alt="초기화"
              className="w-5 h-5 cursor-pointer opacity-70 hover:opacity-100 transition"
            />
          </button>
        )}
      </div>
    </div>
  );
}
