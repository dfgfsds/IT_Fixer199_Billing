// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

/* ================= REQUEST ================= */

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔥 If token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh");

        if (!refreshToken) {
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // 🔥 CALL YOUR REFRESH API
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.access;

        // 🔥 SAVE NEW ACCESS TOKEN
        localStorage.setItem("token", newAccessToken);

        // 🔥 UPDATE HEADER
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 🔥 RETRY ORIGINAL REQUEST
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        // 🔥 If refresh also expired → logout
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

