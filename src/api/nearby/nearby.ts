import api from "@/api/apiMember";
import useUserStore from "@/store/useUserStore";
import {
  NearbyAlongRouteRequest,
  NearbyEditRequest,
  NearbyRequestDTO,
} from "@/types/nearby";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
//경로 목록 조회

export const getnearby = async () => {
  const { data } = await api.get("/routes");
  return data;
};

export const useGetNearby = () => {
  return useQuery({
    queryFn: getnearby,
    queryKey: ["routes"],
  });
};

//route등록하기
export const postNearby = async (body: NearbyRequestDTO) => {
  const { data } = await api.post("/routes", body);
  return data;
};

export const useRouteRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (body: NearbyRequestDTO) => postNearby(body),
    onSuccess: (res) => {
      console.log(res);
      navigate("/nearby");
    },
    onError: (err) => console.error(err),
  });
};

//route 삭제
export const deleteNearby = async (routeId: number) => {
  const { data } = await api.delete(`/routes/${routeId}`);
  return data;
};

export const useRouteDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: number) => deleteNearby(routeId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["routes"],
      });
      console.log(res);
    },
    onError: (err) => console.error(err),
  });
};

//카탈로그 , 경로 주변 탐색

export const postAlongRoute = async (body: NearbyAlongRouteRequest) => {
  const { data } = await api.post("/nearby/along-route", body);
  return data;
};

export const useAlongRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: NearbyAlongRouteRequest) => postAlongRoute(body),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: ["routes"],
      });
      console.log(res);
    },
    onError: (err) => console.error(err),
  });
};
//경로 수정
export const putRoute = async (routeId: number, body: NearbyEditRequest) => {
  const { data } = await api.put(`/routes/${routeId}`, body);
  return data;
};

//경로 수정
export const usePutRoute = (routeId: number) => {
  return useMutation({
    mutationFn: (body: NearbyEditRequest) => putRoute(routeId, body),
    onSuccess: () => console.log("경로수정성공"),
    onError: (err) => console.error(err),
  });
};

//경로 상세조회

export const getDetailRoute = async (routeId: number) => {
  const { data } = await api.get(`/routes/${routeId}`);
  return data;
};

export const useDetailRoute = (routeId: number) => {
  return useQuery({
    queryFn: () => getDetailRoute(routeId),
    queryKey: ["routeDetail", routeId],
    keepPreviousData: false,
  });
};

//가게 메뉴 목록 조회
export const getStoreMenus = async (storeId: number) => {
  const { data } = await api.get(`/menus/stores/${storeId}`);
  return data;
};

export const useStoreMenus = (storeId: number | undefined) => {
  return useQuery({
    queryFn: () => getStoreMenus(storeId as number),
    queryKey: ["storeMenus", storeId],
    // keepPreviousData: false,
    enabled: typeof storeId === "number",
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
    // refetchOnMount: false,
    select: (res) => res.result,
  });
};

//로그아웃

export const postLogout = async () => {
  const { data } = await api.post("/users/me/logout");
  return { data };
};

export const Logout = () => {
  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      console.log("로그아웃성공");
    },
    onError: (err) => console.log(err),
  });
};

//탈퇴
export const deleteUser = async () => {
  const { data } = await api.delete("/users/me", { data: {} });
  return { data };
};

export const useLeaveUser = () => {
  const navigate = useNavigate();
  const { resetUser } = useUserStore();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      sessionStorage.removeItem("cached_geolocation");
      localStorage.removeItem("user");
      localStorage.removeItem("cardImg");
      resetUser();
      navigate("/login");
    },
    onError: (err) => console.log(err),
  });
};
