export type EmailRequestDTO = {
  email: string;
  code: string;
};

export type EmailSend = {
  email: string;
};

export type UserSignUpRequestDto = {
  loginId: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  // gender: string;
  // birthday: string;
  email: string;
};

//로그인
export type LoginRequestDto = {
  loginId: string;
  password: string;
};

//사장 회원가입
export type Location = {
  roadAddress: string;
  latitude: number;
  longitude: number;
  detailAddress?: string;
};

export type OwnerSignupDto = {
  loginId: string;
  password: string;
  email: string;
  businessRegistrationNumber: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  location: Location;
};
