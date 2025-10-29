// 예약 상태 타입
export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

// 예약 생성 요청 DTO
export interface CreateReservationDto {
  foodQuantity: number;
  pickupTime: string; // ISO 8601 format: "2025-10-23T15:30:00.000Z"
}

// 예약 응답 DTO
export interface ReservationDto {
  reservationId: number;
  storeId: number;
  menuId: number;
  pickupTime: string;
  totalAmount: number;
  foodQuantity: number;
  status: ReservationStatus;
  memberEmail: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
