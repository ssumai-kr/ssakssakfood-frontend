export type UserLoginRequestDTO = {
  newLoginId: string;
  currentPassword: string;
};
export type UserPwRequestDTO = {
  newPassword: string;
  currentPassword: string;
};

export type OwnerProfileRequestDTO = {
  ownerName?: null;
  phoneNumber: string;
};
