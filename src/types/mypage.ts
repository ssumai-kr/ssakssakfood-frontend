export type UserLoginRequestDTO = {
  newLoginId: string;
  currentPassword: string;
};
export type UserPwRequestDTO = {
  newPassword: string;
  currentPassword: string;
};

export type OwnerProfileRequestDTO = {
  ownerName?: null | string;
  phoneNumber?: null | string;
};

export type OwnerStoreRequestDTO = {
  storeName?: string | null;
  storePhoneNumber?: string | null;
  roadAddress?: string | null;
  detailAddress?: string | null;
};

export interface OwnerProfileDto {
  storeName: string;
  imageUrl: string;
  roadAddress: string;
  storeId: number;
}
