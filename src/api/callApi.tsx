import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";
import Cookies from "js-cookie";

const BASE_URL = import.meta.env.VITE_API_URL;

export const instance: AxiosInstance = axios.create({
  timeout: 5000,
});

instance.interceptors.request.use(
  (config: any) => {
    config.url = BASE_URL + config.url;
    config.headers.Authorization = `Bearer ${Cookies.get("d_bti_token")}`;

    return config;
  },
  (e) => Promise.reject(e)
);

instance.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (error: AxiosError) => {
    const { response } = error;

    // if (
    //   response?.status === 401 &&
    //   response.data !== "duplicated login" &&
    //   window.location.pathname !== "/"
    // ) {
    //   window.location.replace("/");
    // }

    return Promise.reject(error);
  }
);

export default instance;
