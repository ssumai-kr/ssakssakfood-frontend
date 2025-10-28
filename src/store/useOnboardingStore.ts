import { create } from "zustand";

interface Location {
  roadAddress: string;
  latitude: number;
  longitude: number;
  detailAddress?: string;
}

//닉네임, 이메일 , 비번 , 전번 , 사용자 , 이메일 인증 여부
interface OnboardingState {
  nickname: string;
  phone: string;
  emailVerified: boolean;
  loginId: string;
  email: string;
  memberType: string;
  password: string;
  storeName: string;
  businessRegistrationNumber: string;
  ownerName: string;
  cardUrl: string;
  location: Partial<Location>;
  setTemp: (field: Partial<OnboardingState>) => void;
  reset: () => void;
}

export const useOnboardingState = create<OnboardingState>((set) => ({
  nickname: "",
  password: "",
  phone: "",
  emailVerified: false,
  loginId: "",
  email: "",
  memberType: "",
  storeName: "",
  businessRegistrationNumber: "",
  ownerName: "",
  cardUrl: "",
  location: {},
  setTemp: (field) => set((state) => ({ ...state, ...field })),
  reset: () =>
    set({
      nickname: "",
      //   gender: null,
      //   birth: "",
      password: "",
      phone: "",
      loginId: "",
      emailVerified: false,
      email: "",
      memberType: "",
      businessRegistrationNumber: "",
      ownerName: "",
      storeName: "",
      location: {},
    }),
}));
