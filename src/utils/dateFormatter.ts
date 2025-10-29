/**
 * ISO 8601 날짜 문자열을 "~MM/DD HH:mm 까지" 형식으로 변환합니다.
 * @param isoDateString - ISO 8601 형식의 날짜 문자열 (예: "2025-10-31T18:00:00")
 * @returns 포맷된 날짜 문자열 (예: "~10/31 18:00 까지")
 */
export const formatDeadline = (isoDateString: string): string => {
  try {
    const date = new Date(isoDateString);

    // 유효하지 않은 날짜인 경우
    if (isNaN(date.getTime())) {
      return isoDateString;
    }

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `~${month}/${day} ${hours}:${minutes}`;
  } catch (error) {
    // 에러 발생 시 원본 문자열 반환
    console.log(error);
    return isoDateString;
  }
};
