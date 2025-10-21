interface ProgressBarProps {
  className?: string;
  step?: number; // 0 또는 undefined면 전부 회색
  owner?: boolean;
}

export const ProgressBar = ({
  className = "",
  step = 0,
  owner = false,
}: ProgressBarProps) => {
  const stepArray = [1, 2, 3, 4, 5];
  return (
    <div className={`flex gap-1 ${className}`}>
      {(owner ? stepArray.slice(0, 4) : stepArray).map((i) => (
        <span
          key={i}
          className={`${i <= step ? "bg-main1" : "bg-grey-4"} h-2 w-full rounded-lg`}
        />
      ))}
    </div>
  );
};
