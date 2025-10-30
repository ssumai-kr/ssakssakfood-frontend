import { useQuery, useMutation } from "react-query";
import api from "../apiMember";
import type {
  ApiResponse,
  MenuDetailDto,
  MenuDto,
  MenuSearchParams,
  StoreMenusDto,
  StoreDetailMenuDto,
  TodayMenusDto,
  AllMenusDto,
  CreateMenuDto,
  CreateMenuResponseDto,
  ImageUploadResponseDto,
  UploadTodayMenuDto,
  UpdateMenuDto,
} from "@/types/menu";

/*
특정 메뉴(menuId)의 상세정보를 조회합니다.
같은 매장의 다른 추천 메뉴 최대 3개까지 함께 반환
추천 메뉴 정렬 기준: 마감기한 빠른 순 → 수량 많은 순
 */
export const getMenuDetail = async (menuId: number): Promise<MenuDetailDto> => {
  const { data } = await api.get<ApiResponse<MenuDetailDto>>(
    `/menus/${menuId}/details`,
  );
  return data.result;
};

export const useGetMenuDetail = (menuId: number) => {
  return useQuery({
    queryKey: ["menuDetail", menuId],
    queryFn: () => getMenuDetail(menuId),
    enabled: !!menuId,
  });
};

/*
특정 매장(storeId)의 식품 목록을 조회합니다.
매장 기본 정보(이름, 주소, 이미지)와 함께 반환됩니다.
메뉴 정렬 기준: 마감기한 빠른 순 → 잉여 수량 많은 순
판매 중인 메뉴(surplusQuantity > 0 && deadline != null)만 표시됩니다.
 */
export const getStoreMenus = async (
  storeId: number,
): Promise<StoreMenusDto> => {
  const { data } = await api.get<ApiResponse<StoreMenusDto>>(
    `/menus/stores/${storeId}`,
  );
  return data.result;
};

export const useGetStoreMenus = (storeId: number) => {
  return useQuery({
    queryKey: ["storeMenus", storeId],
    queryFn: () => getStoreMenus(storeId),
    enabled: !!storeId,
  });
};

/*
키워드(식품명 또는 가게명) 또는 카테고리명으로 메뉴를 검색합니다. (회원용)
기본 반경 5km → 없으면 10km → 그래도 없으면 전체 검색
정렬 기준: 거리 오름차순 → 할인율 내림차순
 */
export const searchMenus = async (
  params: MenuSearchParams,
): Promise<MenuDto[]> => {
  const { data } = await api.get<ApiResponse<MenuDto[]>>("/menus/search", {
    params,
  });
  return data.result;
};

export const useSearchMenus = (
  params: MenuSearchParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["searchMenus", params],
    queryFn: () => searchMenus(params),
    enabled: enabled,
  });
};

/*
현재 사용자의 등록 위치를 기준으로 반경 2km 내의 오늘의 등록식품을 조회합니다.
정렬 기준: 할인율 높은 순
 반환 제한: 최대 6개 메뉴
응답 데이터에는 매장명, 거리(km), 할인율, 마감기한, 이미지 등이 포함됩니다.
 */
export const getHomeMenus = async (): Promise<MenuDto[]> => {
  const { data } = await api.get<ApiResponse<MenuDto[]>>("/menus/home");
  return data.result;
};

export const useGetHomeMenus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["homeMenus"],
    queryFn: getHomeMenus,
    enabled: enabled,
  });
};

/*
비회원 또는 대표 주소가 없는 사용자를 위한 홈 메뉴 조회 API입니다.
쿼리 파라미터로 현재 위치의 위도(lat), 경도(lon)를 전달합니다.
위도 경도를 기준으로 반경 2km의 가게들이 조회됩니다.
정렬 기준: 할인율 높은 순
반환 제한: 최대 6개 메뉴
 */
export const getHomeMenusGuest = async (
  lat: number,
  lon: number,
): Promise<MenuDto[]> => {
  const { data } = await api.get<ApiResponse<MenuDto[]>>("/menus/home/guest", {
    params: { lat, lon },
  });
  return data.result;
};

export const useGetHomeMenusGuest = (
  lat: number,
  lon: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["homeMenusGuest", lat, lon],
    queryFn: () => getHomeMenusGuest(lat, lon),
    enabled: enabled && !!lat && !!lon,
  });
};

/*
비회원 또는 대표 주소가 없는 사용자를 위한 메뉴 검색 API입니다.
위도(lat), 경도(lon)와 함께 keyword 또는 category로 검색합니다.
기본 반경 5km → 없으면 10km → 그래도 없으면 전체 검색
정렬 기준: 거리 오름차순 → 할인율 내림차순
 */
export const searchMenusGuest = async (
  lat: number,
  lon: number,
  params: MenuSearchParams,
): Promise<MenuDto[]> => {
  const { data } = await api.get<ApiResponse<MenuDto[]>>(
    "/menus/search/guest",
    {
      params: { lat, lon, ...params },
    },
  );
  return data.result;
};

export const useSearchMenusGuest = (
  lat: number,
  lon: number,
  params: MenuSearchParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["searchMenusGuest", lat, lon, params],
    queryFn: () => searchMenusGuest(lat, lon, params),
    enabled: enabled && !!lat && !!lon,
  });
};

/*
특정 가게(storeId)에 등록된 메뉴 목록을 조회합니다.
응답은 각 메뉴의 이름, 가격, 설명, 이미지 정보 등을 포함합니다.
 */
export const getStoreDetailMenus = async (
  storeId: string,
): Promise<StoreDetailMenuDto[]> => {
  const { data } = await api.get<StoreDetailMenuDto[]>(
    `/stores/${storeId}/menus`,
  );
  return data;
};

export const useGetStoreDetailMenus = (storeId: string) => {
  return useQuery({
    queryKey: ["storeDetailMenus", storeId],
    queryFn: () => getStoreDetailMenus(storeId),
    enabled: !!storeId,
  });
};

/*
가게(storeId)의 오늘 판매 중인 등록식품 목록을 조회합니다.
정렬 기준: 판매중 메뉴 → 마감기한 빠른 순 → 잉여수량 많은 순
판매완료 메뉴는 후순위로 배치
 */
export const getTodayMenus = async (
  storeId: number,
): Promise<TodayMenusDto> => {
  const { data } = await api.get<ApiResponse<TodayMenusDto>>(
    `/menus/stores/${storeId}/menus/today`,
  );
  return data.result;
};

export const useGetTodayMenus = (storeId: number) => {
  return useQuery({
    queryKey: ["todayMenus", storeId],
    queryFn: () => getTodayMenus(storeId),
    enabled: !!storeId,
  });
};

/*
가게(storeId)의 전체 메뉴를 조회합니다.
정렬: 등록 순서 기준
 */
export const getAllStoreMenus = async (
  storeId: number,
): Promise<AllMenusDto> => {
  const { data } = await api.get<ApiResponse<AllMenusDto>>(
    `/menus/stores/${storeId}/menus`,
  );
  return data.result;
};

export const useGetAllStoreMenus = (storeId: number) => {
  return useQuery({
    queryKey: ["allStoreMenus", storeId],
    queryFn: () => getAllStoreMenus(storeId),
    enabled: !!storeId,
  });
};

/*
사장님이 자신의 가게에 새로운 메뉴를 등록합니다.
 */
export const createMenu = async (
  body: CreateMenuDto,
): Promise<CreateMenuResponseDto> => {
  const { data } = await api.post<ApiResponse<CreateMenuResponseDto>>(
    "/menus",
    body,
  );
  return data.result;
};

export const useCreateMenu = () => {
  return useMutation({
    mutationFn: (body: CreateMenuDto) => createMenu(body),
  });
};

/*
특정 메뉴에 이미지를 업로드합니다.
 */
export const uploadMenuImage = async (
  menuId: number,
  imageFile: File,
): Promise<ImageUploadResponseDto> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post<ApiResponse<ImageUploadResponseDto>>(
    `/images/menus/${menuId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return data.result;
};

export const useUploadMenuImage = () => {
  return useMutation({
    mutationFn: ({ menuId, imageFile }: { menuId: number; imageFile: File }) =>
      uploadMenuImage(menuId, imageFile),
  });
};

/*
이미 등록된 메뉴를 오늘의 등록식품으로 전환합니다.
 */
export const uploadTodayMenu = async (
  menuId: number,
  body: UploadTodayMenuDto,
): Promise<MenuDto> => {
  const { data } = await api.patch<ApiResponse<MenuDto>>(
    `/menus/${menuId}/upload-today`,
    body,
  );
  return data.result;
};

export const useUploadTodayMenu = () => {
  return useMutation({
    mutationFn: ({
      menuId,
      body,
    }: {
      menuId: number;
      body: UploadTodayMenuDto;
    }) => uploadTodayMenu(menuId, body),
  });
};

/*
특정 메뉴를 삭제합니다.
 */
export const deleteMenu = async (menuId: number): Promise<string> => {
  const { data } = await api.delete<ApiResponse<string>>(`/menus/${menuId}`);
  return data.result;
};

export const useDeleteMenu = () => {
  return useMutation({
    mutationFn: (menuId: number) => deleteMenu(menuId),
  });
};

/*
메뉴의 기본 정보를 수정합니다.
수정할 필드만 보내면 됩니다.
 */
export const updateMenu = async (
  menuId: number,
  body: UpdateMenuDto,
): Promise<MenuDto> => {
  const { data } = await api.patch<ApiResponse<MenuDto>>(
    `/menus/${menuId}`,
    body,
  );
  return data.result;
};

export const useUpdateMenu = () => {
  return useMutation({
    mutationFn: ({ menuId, body }: { menuId: number; body: UpdateMenuDto }) =>
      updateMenu(menuId, body),
  });
};
