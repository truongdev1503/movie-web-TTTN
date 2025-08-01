import axios from "axios";
import { refreshToken } from "../Utils/api.admin.util";

axios.defaults.baseURL = "https://be-k3g5.onrender.com/api/";

axios.interceptors.request.use(
  function (config) {
    const accessToken = localStorage.getItem("token");
    if (accessToken && config.headers)
      config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
  if (response?.data) return response.data
  return response;
}, async function (error) {
  console.log('Error response:', error);
  console.log(error?.response?.data?.messages[0]?.message);
  if (error?.response?.data?.messages[0]?.message == 'Token is expired' && !error.config._retry) {
    const originalRequest = error.config;
    error.config._retry = true;
    try {
      const res = await refreshToken();
      if(res && res.access){
        const { access } = res;
        console.log('Access token refreshed successfully');

        localStorage.setItem('token', access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return axios(originalRequest);
      }
      else{
        console.error('Failed to refresh access token');
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
        return Promise.reject(new Error('Failed to refresh access token'));
      }
    } catch (error) {
      console.error('Refresh token failed:', error);
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
      return Promise.reject(error);
    }
  }

  else if (error?.response?.data) return {
    error: error?.response?.data
  };
  return Promise.reject(error);
});

export default axios;
