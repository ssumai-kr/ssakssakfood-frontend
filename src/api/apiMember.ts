import useUserStore from "@/store/useUserStore";
import axios from "axios";
//멤버 api

function getAccessToken(): string | null {
  const { user } = useUserStore.getState();
  return user?.accessToken ?? localStorage.getItem("accessToken");
}
const accessToken = getAccessToken();
console.log(accessToken, "ㅌㅌ");

const api = axios.create({
  baseURL: import.meta.env.VITE_MEMBER_SERVER_URL,
});
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
