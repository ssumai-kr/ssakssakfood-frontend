import { useMutation, useQuery } from "react-query";
import type {
  EmailRequestDTO,
  EmailSend,
  LoginRequestDto,
  OwnerSignupDto,
  UserSignUpRequestDto,
} from "../../types/onboarding";
import api from "../apiMember";
import useUserStore from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import axiosLib from "axios";

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
    onError: (err) => {
      if (axiosLib.isAxiosError(err)) {
        if (err.response?.data.code === "BAD_REQUEST") {
          alert(err.response.data.message);
        }
      }
    },
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

//owner 회원가입
export const postOwnerSignup = async (body: OwnerSignupDto) => {
  const { data } = await api.post("/owners/signup", body);
  return data;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (body: OwnerSignupDto) => postOwnerSignup(body),
    onSuccess: (res) => {
      console.log(res);
    },
    onError: (err) => console.log(err),
  });
};

//사장 프로필 이미지 업로드

export const ownerImg = async ({
  memberId,
  body,
}: {
  memberId: number;
  body: FormData;
}) => {
  const { data } = await api.post(`/images/profile/${memberId}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const useOwnerImg = () => {
  return useMutation((vars: { memberId: number; body: FormData }) =>
    ownerImg(vars),
  );
};
