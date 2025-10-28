// 공통 응답 타입
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 카테고리 타입
export type CategoryType =
  | "빵/디저트"
  | "도시락/반찬"
  | "식자재"
  | "식당/조리"
  | "시장"
  | "편의점"
  | "나눔"
  | "착한가게";

// 메뉴 기본 정보
export interface MenuDto {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  surplusQuantity: number;
  imageUrl: string;
  deadline: string;
  storeId: number;
  storeName: string;
  distanceKm: number;
  shared: boolean;
}

// 매장 정보
export interface StoreInfo {
  id: number;
  name: string;
  roadAddress: string;
  detailAddress: string;
  imageUrl: string;
}

// 메뉴 상세 정보
export interface MenuDetailDto {
  id: number;
  name: string;
  category: string;
  originalPrice: number;
  discountPrice: number;
  discountRate: number;
  surplusQuantity: number;
  imageUrl: string;
  deadline: string;
  isShared: boolean;
  store: StoreInfo;
  otherMenus: MenuDto[];
}

// 매장별 메뉴 목록
export interface StoreMenusDto {
  storeId: number;
  storeName: string;
  roadAddress: string;
  detailAddress: string;
  imageUrl: string;
  menus: MenuDto[];
}

// 메뉴 검색 파라미터
export interface MenuSearchParams {
  keyword?: string;
  category?: CategoryType;
}

// 매장 상세 메뉴 (카테고리 객체 포함)
export interface CategoryInfo {
  id: number;
  name: string;
}

export interface StoreDetailInfo {
  id: number;
  ownerMemberId: number;
  name: string;
  roadAddress: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  phone: string;
  imageUrl: string;
  businessRegistrationNumber: string;
  ownerName: string;
  goodStore: boolean;
}

export interface StoreDetailMenuDto {
  createdAt: string;
  updatedAt: string;
  id: number;
  category: CategoryInfo;
  store: StoreDetailInfo;
  name: string;
  originalPrice: number;
  discountPrice: number;
  surplusQuantity: number;
  isShared: boolean;
  imageUrl: string;
  deadline: string;
}
