//내 프로필 조회

import api from "@/api/apiMember";
import {
  OwnerProfileRequestDTO,
  OwnerStoreRequestDTO,
  UserLoginRequestDTO,
  UserPwRequestDTO,
} from "@/types/mypage";
import { useMutation, useQuery, useQueryClient } from "react-query";

//사용자 내 프로필 조회
export const getMyProfile = async () => {
  const { data } = await api.get("/users/me");
  return data;
};
export const useMyProfile = () => {
  return useQuery({
    queryFn: getMyProfile,
    queryKey: ["myProfile"],
  });
};

//사장 내프로필 조회
export const getOwnerProfile = async () => {
  const { data } = await api.get("/owners/me");
  return data;
};
export const useGetOwnerProfile = () => {
  return useQuery({
    queryFn: getOwnerProfile,
    queryKey: ["ownerProfile"],
    select: (res) => res.data,
  });
};

//프로필 이미지 업로드
export const postProfileImg = async (memberId: number) => {
  const { data } = await api.post(`/images/profile/${memberId}`);
  return data;
};

//닉네임 수정
export const patchNickname = async (body: { nickname: string }) => {
  const { data } = await api.patch("/users/me/nickname", body);
  return data;
};

export const usePatchNickname = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nickname: string) => patchNickname({ nickname }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};

//아이디 수정

//body
// "newLoginId": "S7RDoHl2zPz",
// "currentPassword": "string"

export const patchUserId = async (body: UserLoginRequestDTO) => {
  const { data } = await api.patch("/users/me/login-id", body);
  return data;
};

export const usePatchUserId = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UserLoginRequestDTO) => patchUserId(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};

//비밀번호 수정
export const pathchPw = async (body: UserPwRequestDTO) => {
  const { data } = await api.patch("/users/me/password", body);
  return data;
};

export const usePatchPw = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UserPwRequestDTO) => pathchPw(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};

//휴대폰 번호 수정
export const pathchPhone = async (body: { phone: string }) => {
  const { data } = await api.patch("/users/me/phone", body);
  return data;
};

export const usePatchPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (phone: string) => pathchPhone({ phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};

//이미지 등록

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

//사장프로필 변경 (대표자명,전화번호 변경함)
export const patchOwnerProfile = async (body: OwnerProfileRequestDTO) => {
  const { data } = await api.patch("/owners/me/profile", body);
  return data;
};

export const usePatchOwnerProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OwnerProfileRequestDTO) => patchOwnerProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ownerProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};

//store프로필 변경(가게명)
export const patchOwnerStore = async (body: OwnerStoreRequestDTO) => {
  const { data } = await api.patch("/owners/me/store", body);
  return data;
};

export const usePatchOwnerStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: OwnerStoreRequestDTO) => patchOwnerStore(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ownerProfile"],
      });
      console.log("성공");
    },
    onError: (err) => console.log(err),
  });
};
