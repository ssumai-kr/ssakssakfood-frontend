interface ProgressBarProps {
  className?: string;
  step?: number; // 0 또는 undefined면 전부 회색
}

export const ProgressBar = ({ className = "", step = 0 }: ProgressBarProps) => {
  const stepArray = [1, 2, 3, 4, 5];

  return (
    <div className={`flex gap-1 ${className}`}>
      {stepArray.map((i) => (
        <span
          key={i}
          className={`${i <= step ? "bg-main1" : "bg-grey-4"} h-2 w-full rounded-lg`}
        />
      ))}
    </div>
  );
};
