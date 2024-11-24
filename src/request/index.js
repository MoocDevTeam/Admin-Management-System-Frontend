import axios from "axios";
import toast from "react-hot-toast";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL + "/api",
  timeout: 1000000,
  responseType: "json",
  responseEncoding: "utf8",
});

//Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    //Get access token for headers
    const accesstoken = localStorage.getItem("access_token");
    if (accesstoken) {
      config.headers.Authorization = `Bearer ${accesstoken}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

//Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    if (response.status === 200) {
      return response.data;
    } else {
    }

    return response;
  },
  function (error) {
    if (error.response) {
      if (error.response.status === 401) {
        toast.error("Unauthenticated!");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_permission");
        window.location.href = "/login";
        return { status: 401, data: {}, message: "Unauthenticated" };
      } else if (error.response.status === 403) {
        toast.error("unauthorized!");
        return { status: 403, data: {}, message: "unauthorized" };
      } else if (error.response.status === 400) {
        let errorMessage = "BadRequest";
        if (typeof error.response.data.message === "string")
          errorMessage = error.response.data.message;
        return {
          status: 400,
          isSuccess: false,
          data: error.response.data,
          message: errorMessage,
        };
      } else {
        if (
          error.response.data &&
          error.response.data.status &&
          error.response.data.message
        ) {
          if (error.response.data.message instanceof Array) {
            toast.error(error.response.data.message[0].msg);
          } else if (typeof error.response.data.message === "string") {
            toast.error(error.response.data.message);
          } else {
            toast.error("request error!");
          }
          return {
            status: 400,
            isSuccess: false,
            data: {},
            message: "request error!",
          };
        }
        toast.error("request error!");
        return {
          status: 500,
          isSuccess: false,
          data: {},
          message: "request error!",
        };
      }
    } else {
      return {
        status: 500,
        isSuccess: false,
        data: {},
        message: "request error!",
      };
    }
  }
);

export default instance;
