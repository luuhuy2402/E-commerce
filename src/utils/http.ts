import axios, { AxiosInstance } from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import {
    clearLS,
    getAccessTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
} from "./auth";
import { AuthResponse } from "../types/auth.type";
import path from "../constants/path";

class Http {
    instance: AxiosInstance;
    private accessToken: string;
    constructor() {
        //Khởi tạo thêm biến để lưu trữ trên ram mỗi lần sd nhanh hơn là lấy từ localStorage
        this.accessToken = getAccessTokenFromLS();
        this.instance = axios.create({
            baseURL: "https://api-ecom.duthanhduoc.com/",
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.authorization = this.accessToken;
                    return config;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add a response interceptor
        this.instance.interceptors.response.use(
            (response) => {
                const { url } = response.config;
                if (url === path.login || url === path.register) {
                    const data = response.data as AuthResponse;
                    this.accessToken = data.data.access_token;

                    setAccessTokenToLS(this.accessToken);
                    setProfileToLS(data.data.user);
                } else if (url === path.logout) {
                    this.accessToken = "";
                    clearLS();
                }
                return response;
            },
            function (error) {
                if (
                    error.response?.status !==
                    HttpStatusCode.UnprocessableEntity
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data: any | undefined = error.response?.data;
                    const message = data.message || error.message;
                    toast.error(message);
                }
                return Promise.reject(error);
            }
        );
    }
}

const http = new Http().instance;
export default http;
