import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL 

type TokenType ="user_accessToken" | "driver_accessToken" | "admin_accessToken";


export const UserAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/users`,
  withCredentials: true, 
});

export const DriverAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/drivers`,
  withCredentials: true,
});

export const AdminAPI: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/admin`,
  withCredentials: true,
});

const attachToken = (instance: AxiosInstance, tokenKey: TokenType) => {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem(tokenKey);
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );
};

attachToken(UserAPI, "user_accessToken");
attachToken(DriverAPI, "driver_accessToken");
attachToken(AdminAPI, "admin_accessToken");

const redirectToLogin = (tokenKey: TokenType) => {
  const loginRoutes: Record<TokenType, string> = {
    user_accessToken: "/login?type=user",
    driver_accessToken: "/login?type=driver",
    admin_accessToken: "/admin",
  };
  window.location.href = loginRoutes[tokenKey];
};


const attachResponseInterceptor = (instance: AxiosInstance, tokenKey: TokenType) => {
  instance.interceptors.response.use(
    (response: AxiosResponse) => response, 
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry){
        if ((error.response?.data as any)?.blocked) {
          console.warn("Blocked account detected. Redirecting to login...");
          alert("Your account has been blocked. Please contact support.");
          localStorage.removeItem(tokenKey);
          redirectToLogin(tokenKey);
          return Promise.reject(error);
        }
        originalRequest._retry = true; // Prevent infinite loop
  
        try {
          const role = tokenKey === "user_accessToken" ? "user" 
          : tokenKey === "driver_accessToken" ? "driver" 
          : "admin";
          const res = await axios.post<{ accessToken: string }>(
            `${BASE_URL}/auth/refresh-token`, 
            {role},  
            { withCredentials: true } 
          );
        
          
          const newAccessToken = res.data.accessToken;

          localStorage.setItem(tokenKey, newAccessToken);

       
          if (originalRequest.headers) {
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Refresh token expired. Logging out...", refreshError);

          localStorage.removeItem(tokenKey);
          redirectToLogin(tokenKey);

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};


attachResponseInterceptor(UserAPI, "user_accessToken");
attachResponseInterceptor(DriverAPI, "driver_accessToken");
attachResponseInterceptor(AdminAPI, "admin_accessToken");
