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
