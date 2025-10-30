import { useMutation, useQuery } from "react-query";
import api from "../apiMember";
import type {
  CreateReservationDto,
  ReservationDto,
  MyReservationDto,
  OwnerReservationDto,
  ApiResponse,
} from "@/types/reservation";

/*
특정 메뉴(menuId)에 대해 예약을 생성합니다.
요청 필드:
- foodQuantity: 예약 수량 (1 이상 정수)
- pickupTime: 수령 시각 (예: 2025-10-23T15:30:00.000Z)
*/
export const createReservation = async (
  menuId: number,
  body: CreateReservationDto,
): Promise<ReservationDto> => {
  const { data } = await api.post<ApiResponse<ReservationDto>>(
    `/reservations/menus/${menuId}`,
    body,
  );
  return data.result;
};

export const useCreateReservation = () => {
  return useMutation({
    mutationFn: ({
      menuId,
      body,
    }: {
      menuId: number;
      body: CreateReservationDto;
    }) => createReservation(menuId, body),
  });
};

/*
고객이 자신이 예약한 모든 내역을 조회합니다.
*/
export const getMyReservations = async (): Promise<MyReservationDto[]> => {
  const { data } =
    await api.get<ApiResponse<MyReservationDto[]>>(`/reservations/my`);
  return data.result;
};

export const useGetMyReservations = () => {
  return useQuery({
    queryKey: ["myReservations"],
    queryFn: getMyReservations,
  });
};

/*
특정 가게(storeId)에 대해 지정한 날짜(date)에 해당하는 예약 내역을 조회합니다.
날짜는 yyyy-MM-dd 형식으로 전달합니다.
*/
export const getStoreReservationsByDate = async (
  storeId: number,
  date: string,
): Promise<OwnerReservationDto[]> => {
  const { data } = await api.get<ApiResponse<OwnerReservationDto[]>>(
    `/reservations/store/${storeId}/date`,
    {
      params: { date },
    },
  );
  return data.result;
};

export const useGetStoreReservationsByDate = (
  storeId: number | undefined,
  date: string,
) => {
  return useQuery({
    queryKey: ["storeReservations", storeId, date],
    queryFn: () => getStoreReservationsByDate(storeId!, date),
    enabled: !!storeId,
  });
};

/*
특정 예약 ID에 해당하는 예약을 확정합니다.
예약 상태가 'COMPLETED'로 변경됩니다.
*/
export const confirmReservation = async (
  reservationId: number,
): Promise<void> => {
  await api.patch<ApiResponse<Record<string, never>>>(
    `/reservations/${reservationId}/confirm`,
  );
};

export const useConfirmReservation = () => {
  return useMutation({
    mutationFn: (reservationId: number) => confirmReservation(reservationId),
  });
};

/*
특정 예약 ID에 해당하는 예약을 취소합니다.
예약 상태가 'CANCELED'로 변경됩니다.
*/
export const cancelReservation = async (
  reservationId: number,
): Promise<void> => {
  await api.patch<ApiResponse<Record<string, never>>>(
    `/reservations/${reservationId}/cancel`,
  );
};

export const useCancelReservation = () => {
  return useMutation({
    mutationFn: (reservationId: number) => cancelReservation(reservationId),
  });
};
