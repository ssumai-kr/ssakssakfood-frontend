// PortOne (아임포트) 결제 타입 정의

// 결제 방법
export type PayMethod = "card" | "trans" | "vbank" | "phone";

// PG사
export type PG = "html5_inicis" | "kcp" | "nice" | "kakaopay" | "payco";

// 결제 요청 파라미터
export interface PaymentRequest {
  pg: PG;
  pay_method: PayMethod;
  merchant_uid: string; // "reservation_" + reservationId
  name: string; // 주문명
  amount: number; // 결제 금액
  buyer_email?: string;
  buyer_name?: string;
  notice_url?: string; // 웹훅 URL
}

// 결제 응답
export interface PaymentResponse {
  success: boolean;
  error_msg?: string;
  error_code?: string;
  imp_uid?: string; // 아임포트 고유 결제 번호
  merchant_uid?: string; // 가맹점 주문번호
  pay_method?: PayMethod;
  paid_amount?: number;
  status?: string;
  name?: string;
  pg_provider?: string;
  pg_tid?: string;
  buyer_name?: string;
  buyer_email?: string;
  buyer_tel?: string;
  buyer_addr?: string;
  buyer_postcode?: string;
  custom_data?: string;
  paid_at?: number;
  receipt_url?: string;
}

// PortOne SDK 인터페이스
export interface IMP {
  init: (userCode: string) => void;
  request_pay: (
    params: PaymentRequest,
    callback: (response: PaymentResponse) => void,
  ) => void;
}

// Window 객체에 IMP 추가
declare global {
  interface Window {
    IMP?: IMP;
  }
}
