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

// 내 예약 목록 조회
export interface MyReservationDto {
  reservationId: number;
  menuName: string;
  storeName: string;
  menuImageUrl: string;
  foodQuantity: number;
  totalAmount: number;
  reservedAt: string;
  pickupTime: string;
  status: ReservationStatus;
}

// 사장님 예약 목록 조회 (특정 날짜)
export interface OwnerReservationDto {
  reservationId: number;
  menuName: string;
  menuImageUrl: string;
  foodQuantity: number;
  totalAmount: number;
  pickupTime: string;
  status: ReservationStatus;
  customerName: string;
  customerPhone: string;
}

// API 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
