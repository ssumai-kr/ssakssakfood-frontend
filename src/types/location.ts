//위치 추가하기

export type locationSavedRequest = {
  kakaoPlaceId: string;
  bcode: string;
  sido: string;
  sigungu: string;
  dong: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  latitude: number;
  longitude: number;
};

//gps현재위치 추가하기
export type gpsLocationSavedRequest = {
  latitude: number;
  longitude: number;
  buildingName: string;
  jibunAddress: string;
  capturedA?: string;
  accuracyMeters?: number;
};

//
export type myLocationResponseDto = {
  userLocationId: number;
  isPrimary: true;
  orderIndex: 0;
  displayName: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  latitude: number;
  longitude: number;
  locationId: number;
};
