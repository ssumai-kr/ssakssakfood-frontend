import { useMutation, useQuery, useQueryClient } from "react-query";
import type {
  gpsLocationSavedRequest,
  locationSavedRequest,
} from "../../types/location";
import api from "../apiMember";

//회원 주소 추가
export const postLocation = async (payload: locationSavedRequest) => {
  const res = await api.post("/locations/saved", payload);
  return res.data.data;
};

//회원 현재 위치 추가
export const postGpsLocation = async (payload: gpsLocationSavedRequest) => {
  const res = await api.post("/locations/current", payload);
  return res.data.data;
};

// 대표 위치 조회 (홈 상단)
export const getMyPrimaryLocation = async () => {
  const { data } = await api.get("/locations/primary");
  return data;
};

export const useGetMyPrimaryLocation = () => {
  return useQuery({
    queryFn: getMyPrimaryLocation,
    queryKey: ["primaryLocation"],
  });
};

//내 저장 위치 5개 조회
export const getMyLocation = async () => {
  const { data } = await api.get("/locations/saved");
  return data;
};

export const useGetMyLocation = () => {
  return useQuery({
    queryFn: getMyLocation,
    queryKey: ["myLocation"],
  });
};

//위치 삭제
export const deleteLocation = async (userLocationId: number) => {
  const { data } = await api.delete(`/locations/saved/${userLocationId}`);
  return data;
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLocation(id),
    onSuccess: () => {
      console.log("성공");
      queryClient.invalidateQueries({
        queryKey: ["myLocation"],
      });
      queryClient.invalidateQueries({ queryKey: ["primaryLocation"] });
    },
    onError: (err) => console.log(err),
  });
};

//대표위치 조정
export const PatchPrimaryLocation = async (id: number) => {
  const { data } = await api.patch(`/locations/saved/${id}/primary`);
  return data;
};

export const usePatchLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PatchPrimaryLocation(id),
    onSuccess: () => {
      console.log("성공");
      queryClient.invalidateQueries({
        queryKey: ["myLocation"],
      });
      queryClient.invalidateQueries({ queryKey: ["primaryLocation"] });
    },
    onError: (err) => console.log(err),
  });
};
