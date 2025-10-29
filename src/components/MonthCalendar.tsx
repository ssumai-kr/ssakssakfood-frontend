import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DateFilterModal({
  open,
  onClose,
  selectedDate,
  onSelect,
  markedDates = [],
  hideOutsideDays = true, // ← 바깥달 날짜 숨김 (mock과 동일)
  showYearInHeader = false, // ← 헤더에 연도 숨김 (mock과 동일)
}: {
  open: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onSelect: (d: Date) => void;
  markedDates?: string[];
  hideOutsideDays?: boolean;
  showYearInHeader?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const init = selectedDate ?? new Date();
  const [visibleYear, setVisibleYear] = useState(init.getFullYear());
  const [visibleMonth, setVisibleMonth] = useState(init.getMonth()); // 0-11

  useEffect(() => {
    if (open && selectedDate) {
      setVisibleYear(selectedDate.getFullYear());
      setVisibleMonth(selectedDate.getMonth());
    }
  }, [open, selectedDate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const weeks = useMemo(
    () => buildMonthMatrix(visibleYear, visibleMonth),
    [visibleYear, visibleMonth],
  );

  const headerLabel = showYearInHeader
    ? `${visibleYear}년 ${visibleMonth + 1}월`
    : `${visibleMonth + 1}월`;

  const today = new Date();
  const isMarked = (y: number, m: number, d: number) =>
    markedDates.includes(fmt(y, m + 1, d));

  const isSameDay = (a?: Date | null, y?: number, m?: number, d?: number) =>
    !!a &&
    y !== undefined &&
    m !== undefined &&
    d !== undefined &&
    a.getFullYear() === y &&
    a.getMonth() === m &&
    a.getDate() === d;

  const gotoPrev = () => {
    const date = new Date(visibleYear, visibleMonth - 1, 1);
    setVisibleYear(date.getFullYear());
    setVisibleMonth(date.getMonth());
  };
  const gotoNext = () => {
    const date = new Date(visibleYear, visibleMonth + 1, 1);
    setVisibleYear(date.getFullYear());
    setVisibleMonth(date.getMonth());
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (outside click close) */}
          <motion.button
            aria-label="닫기"
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[1100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            className="fixed left-1/2 bottom-0 -translate-x-1/2 w-full max-w-[401px] z-[1101]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
          >
            <div className=" rounded-t-2xl bg-white shadow-xl ">
              {/* grabber */}
              <div className="pt-2 flex justify-center">
                <div className="h-1.5 w-12 rounded-full bg-black/10" />
              </div>

              {/* Header */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between">
                <span className="font-semibold text-[15px]">날짜 필터</span>
              </div>

              {/* Month switcher */}
              <div className="px-5 pb-2 flex items-center justify-between">
                <button
                  onClick={gotoPrev}
                  className="p-2 rounded-lg hover:bg-black/5"
                  aria-label="이전 달"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-[15px] font-medium select-none">
                  {headerLabel}
                </span>
                <button
                  onClick={gotoNext}
                  className="p-2 rounded-lg hover:bg-black/5"
                  aria-label="다음 달"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="px-5 grid grid-cols-7 gap-y-1 text-center text-xs text-neutral-500">
                {K_WEEKDAYS.map((w, i) => (
                  <div key={w} className={i === 0 ? "text-red-500" : ""}>
                    {w}
                  </div>
                ))}
              </div>

              {/* Dates */}
              <div className="p-5 pt-2 grid grid-cols-7 gap-y-3 text-center select-none">
                {weeks.map((week, wi) =>
                  week.map((cell) => {
                    const key = `${wi}-${cell.year}-${cell.month}-${cell.date}`;
                    const isThisMonth = cell.month === visibleMonth;
                    const disabled = !isThisMonth;
                    const isToday = isSameDay(
                      today,
                      cell.year,
                      cell.month,
                      cell.date,
                    );
                    const selected = isSameDay(
                      selectedDate,
                      cell.year,
                      cell.month,
                      cell.date,
                    );

                    // 바깥달 숨김
                    if (disabled && hideOutsideDays) {
                      return <div key={key} className="h-9 w-9 mx-auto" />;
                    }

                    return (
                      <button
                        key={key}
                        onClick={() =>
                          !disabled &&
                          onSelect(new Date(cell.year, cell.month, cell.date))
                        }
                        className={[
                          "relative h-9 w-9 mx-auto grid place-items-center rounded-md",
                          disabled ? "text-neutral-300" : "text-neutral-900",
                          selected
                            ? "ring-1 ring-main1 bg-sub1" // 얇은 오렌지 테두리
                            : "hover:bg-neutral-100",
                        ].join(" ")}
                        disabled={disabled}
                        aria-pressed={selected}
                      >
                        <span className="text-sm tabular-nums">
                          {cell.date}
                        </span>
                        {(isToday ||
                          isMarked(cell.year, cell.month, cell.date)) && (
                          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-red-500 shrink-0" />
                        )}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const K_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function buildMonthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekDay = first.getDay();
  const daysInThisMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = new Date(year, month, 0);
  const daysInPrev = prevMonth.getDate();

  const cells: { year: number; month: number; date: number }[] = [];

  // prev month tail
  for (let i = startWeekDay - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const pm = month - 1;
    const y = pm < 0 ? year - 1 : year;
    const m = (pm + 12) % 12;
    cells.push({ year: y, month: m, date: d });
  }
  // this month
  for (let d = 1; d <= daysInThisMonth; d++)
    cells.push({ year, month, date: d });
  // next month head
  const remain = (7 - (cells.length % 7)) % 7;
  for (let d = 1; d <= remain; d++) {
    const nm = month + 1;
    const y = nm > 11 ? year + 1 : year;
    const m = nm % 12;
    cells.push({ year: y, month: m, date: d });
  }

  // chunk into weeks
  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function fmt(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}
