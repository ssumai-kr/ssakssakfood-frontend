import React, { useRef, useState, useEffect, useCallback } from "react";

interface PickerItem {
  value: string | number;
  label: string;
}

interface DialPickerProps {
  items: PickerItem[];
  selectedValue: string | number;
  onValueChange: (value: string | number) => void;
  unit?: string;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3;
const HALF_VISIBLE = Math.floor(VISIBLE_ITEMS / 2);

const PADDING_ARRAY: (PickerItem | null)[] = Array(HALF_VISIBLE).fill(null);
const SCROLL_SPEED_MULTIPLIER = 0.1;

const DialPicker: React.FC<DialPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  unit = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);
  const snapTimerRef = useRef<number | null>(null);

  const selectedIndex = items.findIndex((item) => item.value === selectedValue);

  // 1. 스크롤이 멈췄을 때 가장 가까운 항목으로 스냅하고 최종 값을 업데이트
  const snapToClosestItem = useCallback(() => {
    if (!containerRef.current) return;

    const currentScrollTop = containerRef.current.scrollTop;
    // 반올림하여 가장 가까운 인덱스 계산
    let newIndex = Math.round(currentScrollTop / ITEM_HEIGHT);

    newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
    const snapToPosition = newIndex * ITEM_HEIGHT;

    containerRef.current.scrollTo({
      top: snapToPosition,
      behavior: "smooth",
    });

    const newValue = items[newIndex].value;
    if (newValue !== selectedValue) {
      onValueChange(newValue);
    }
  }, [items, selectedValue, onValueChange]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const currentScrollTop = containerRef.current.scrollTop;
    // 현재 스크롤 위치를 항목 높이로 나누고 반올림하여 중앙에 있는 인덱스를 계산합니다.
    const newIndex = Math.max(
      0,
      Math.min(items.length - 1, Math.round(currentScrollTop / ITEM_HEIGHT)),
    );

    const newValue = items[newIndex].value;

    if (newValue !== selectedValue) {
      onValueChange(newValue);
    }

    // 스크롤이 멈추면 snapToClosestItem을 호출하도록 타이머 초기화 (debouncing)
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
    }
    // 드래그 중이 아닐 때만 스냅 타이머를 설정합니다.
    if (!isDragging) {
      snapTimerRef.current = setTimeout(() => {
        snapToClosestItem();
      }, 150) as unknown as number;
    }
  }, [items, selectedValue, onValueChange, isDragging, snapToClosestItem]);

  // 초기 위치 설정 (선택된 항목으로 스크롤)
  useEffect(() => {
    if (containerRef.current && selectedIndex !== -1) {
      const initialOffset = selectedIndex * ITEM_HEIGHT;
      containerRef.current.scrollTop = initialOffset;
    }
  }, [items, selectedIndex]);

  // 마우스 휠 이벤트 처리
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    event.preventDefault();

    const scrollAmount = event.deltaY;
    const adjustedScrollAmount = scrollAmount * SCROLL_SPEED_MULTIPLIER;

    containerRef.current.scrollTop += adjustedScrollAmount;
    handleScroll();
  };

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    if (snapTimerRef.current) {
      clearTimeout(snapTimerRef.current);
    }

    setIsDragging(true);
    const clientY =
      "touches" in event ? event.touches[0].clientY : event.clientY;

    setStartY(clientY);
    setStartScrollTop(containerRef.current.scrollTop);

    if ("touches" in event) {
      containerRef.current.style.touchAction = "none";
    }
  };

  // 드래그 중
  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const clientY =
      "touches" in event ? event.touches[0].clientY : event.clientY;
    const deltaY = clientY - startY;

    containerRef.current.scrollTop = startScrollTop - deltaY;
    handleScroll();
  };

  // 드래그 끝
  const handleEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.touchAction = "auto";
      }
      snapToClosestItem();
    }
  };

  const allItems = [...PADDING_ARRAY, ...items, ...PADDING_ARRAY];

  return (
    <div className="relative flex flex-col items-center w-1/3">
      <div
        ref={containerRef}
        className={`w-full overflow-y-scroll no-scrollbar`}
        style={{ height: VISIBLE_ITEMS * ITEM_HEIGHT }}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {allItems.map((item, index) => {
          if (!item) {
            return <div key={`padding-${index}`} className="h-10" />;
          }
          const isSelected = item.value === selectedValue;

          return (
            <div
              key={item.value}
              className="h-10 flex items-center justify-center transition-colors duration-100 cursor-grab"
            >
              <span
                className={`text-xl transition-all duration-100 min-w-[2.5rem] text-center
                  ${isSelected ? "text-[#FE7549] font-bold text-2xl" : "text-gray-600"}`}
              >
                {item.label}
              </span>
              <span
                className={`text-sm text-[#FE7549] font-bold ml-1 transition-opacity ${unit && isSelected ? "opacity-100" : "opacity-0"}`}
              >
                {unit || "분"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DialPicker;
