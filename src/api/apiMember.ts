import axios from "axios";
//멤버 api
const TEMP_TOKEN = import.meta.env.VITE_APP_DEV_TOKEN;

const api = axios.create({
  baseURL:
    "http://saksakfood-api-gateway-s-da7e9-110329723-31b4b99c070a.kr.lb.naverncp.com/api",
  headers: {
    Authorization: `Bearer ${TEMP_TOKEN}`,
  },
});

export default api;
