import axios from "axios";

const baseConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const createInstance = (baseUrl, useAuth) => {
  const instance = axios.create({
    ...baseConfig,
    baseURL: baseUrl,
  });

  if (useAuth) {
    instance.interceptors.request.use(
      async (config) => {
        const accessToken = JSON.parse(
          localStorage.getItem("authTokens")
        )?.access;
        if (accessToken) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
          };
        }
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }

  return instance;
};
