// CategoryBadge.tsx
import { forwardRef } from "react";

interface CategoryBadgeProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const CategoryBadge = forwardRef<HTMLButtonElement, CategoryBadgeProps>(
  ({ label, active, onClick }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`px-4 py-2 rounded-full border border-gray-300 whitespace-nowrap ${
          active ? "bg-[#FE7549] text-white" : "bg-white text-black"
        }`}
      >
        {label}
      </button>
    );
  },
);

CategoryBadge.displayName = "CategoryBadge";

export default CategoryBadge;
