function CurrentDateDisplayWithDateObject() {
  // 현재 Date 객체를 생성합니다. (컴포넌트 렌더링 시점의 날짜)
  const currentDate = new Date();

  // 1. 월 (Month)
  // getMonth()는 0부터 시작 (0: 1월, 9: 10월 등)하므로 +1을 해줍니다.
  const month = currentDate.getMonth() + 1;

  // 2. 일 (Day)
  const day = currentDate.getDate();

  // 3. 요일 (Weekday)
  // getDay()는 0부터 6까지의 숫자를 반환합니다. (0: 일요일, 6: 토요일)
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = daysOfWeek[currentDate.getDay()];

  // 4. 포맷팅
  const formattedDate = `${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")} (${dayName})`;

  return <div>{formattedDate}</div>;
}

export default CurrentDateDisplayWithDateObject;
