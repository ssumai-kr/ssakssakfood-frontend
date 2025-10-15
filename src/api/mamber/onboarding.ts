import { useMutation, useQuery } from "react-query";
import type {
  EmailRequestDTO,
  EmailSend,
  LoginRequestDto,
  UserSignUpRequestDto,
} from "../../types/onboarding";
import api from "../apiMember";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";

export const onBoardingEmail = async (body: EmailSend) => {
  const { data } = await api.post("/email/send", body);
  return data;
};

export const onBoardingEmailCode = async (body: EmailRequestDTO) => {
  const { data } = await api.post("/email/verify", body);
  return data;
};

export const onBoardingSignup = async (body: UserSignUpRequestDto) => {
  const { data } = await api.post("/users/signup", body);
  return data;
};

//중복쳌
export const getCheckNickname = async (nickname: string) => {
  const { data } = await api.get("/users/checknickname", {
    params: { nickname },
  });
  return data;
};
export const useNicknameCheck = (nickname: string) => {
  return useQuery({
    queryKey: ["nickname", nickname],
    enabled: false,
    queryFn: () => getCheckNickname(nickname),

    select: (res) => res.data,
  });
};

//user로그인
export const userLogin = async (body: LoginRequestDto) => {
  const { data } = await api.post("/users/login", body);
  return data;
};

export const useUserLogin = () => {
  const setUser = useUserStore((store) => store.setUser);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (body: LoginRequestDto) => userLogin(body),
    onSuccess: (user) => {
      console.log(user);
      setUser({
        accessToken: user.data.accessToken,
        memberId: user.data.memberId,
        memberType: user.data.memberType,
      });
      navigate("/");
    },
    onError: (error) => console.log(error),
  });
};

//카드 이미지  업로드
export const upLoadImg = async (memberId: number, body: FormData) => {
  const { data } = await api.post(`/images/child-meal-card/${memberId}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useUploadImg = (memberId: number) => {
  return useMutation({
    mutationFn: (formData: FormData) => upLoadImg(memberId, formData),
    onSuccess: () => {
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};
