import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import { toast } from "react-toastify";
import {
    clearLS,
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
    setRefreshTokenToLS,
} from "./auth";
import { AuthResponse, RefreshTokenReponse } from "../types/auth.type";
import config from "../constants/config";
import {
    URL_LOGIN,
    URL_LOGOUT,
    URL_REFRESH_TOKEN,
    URL_REGISTER,
} from "../apis/auth.api";
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from "./utils";
import { ErrorResponse } from "../types/utils.type";

class Http {
    instance: AxiosInstance;
    private accessToken: string;
    private refreshToken: string;
    private refreshTokenRequest: Promise<string> | null;
    constructor() {
        //Khởi tạo thêm biến để lưu trữ trên ram mỗi lần sd nhanh hơn là lấy từ localStorage
        this.accessToken = getAccessTokenFromLS();
        this.refreshToken = getRefreshTokenFromLS();
        this.refreshTokenRequest = null;
        this.instance = axios.create({
            baseURL: config.baseUrl,
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
                "expire-access-token": 5, // 10 giây
                "expire-refresh-token": 60 * 60, // 1 giờ
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
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const data = response.data as AuthResponse;
                    this.accessToken = data.data.access_token;

                    setAccessTokenToLS(this.accessToken);
                    setRefreshTokenToLS(data.data.refresh_token);
                    setProfileToLS(data.data.user);
                    this.refreshToken = data.data.refresh_token;
                } else if (url === URL_LOGOUT) {
                    this.accessToken = "";
                    this.refreshToken = "";
                    clearLS();
                }
                return response;
            },
            (error: AxiosError) => {
                // Chỉ toast lỗi không phải 422 và 401
                if (
                    ![
                        HttpStatusCode.UnprocessableEntity,
                        HttpStatusCode.Unauthorized,
                    ].includes(error.response?.status as number)
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data: any | undefined = error.response?.data;
                    const message = data?.message || error.message;
                    toast.error(message);
                }
                // Lỗi Unauthorized (401) có rất nhiều trường hợp
                // - Token không đúng
                // - Không truyền token
                // - Token hết hạn*

                // Nếu là lỗi 401
                if (
                    isAxiosUnauthorizedError<
                        ErrorResponse<{ name: string; message: string }>
                    >(error)
                ) {
                    // const config = error.response?.config || {};
                    // console.log("config", config);
                    const config =
                        error.response?.config ||
                        ({ headers: {} } as InternalAxiosRequestConfig);
                    const { url } = config;

                    // Trường hợp Token hết hạn và request đó không phải là của request refresh token
                    // thì chúng ta mới tiến hành gọi refresh token
                    console.log(config);
                    if (
                        isAxiosExpiredTokenError(error) &&
                        url !== URL_REFRESH_TOKEN
                    ) {
                        // Hạn chế gọi 2 lần handleRefreshToken
                        this.refreshTokenRequest = this.refreshTokenRequest
                            ? this.refreshTokenRequest
                            : this.handleRefreshToken().finally(() => {
                                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                                  setTimeout(() => {
                                      this.refreshTokenRequest = null;
                                  }, 10000);
                              });
                        return this.refreshTokenRequest.then((access_token) => {
                            //chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                            return this.instance({
                                ...config,
                                headers: {
                                    ...config.headers,
                                    authorization: access_token,
                                },
                            });
                        });
                    }

                    // Còn những trường hợp như token không đúng
                    // không truyền token,
                    // token hết hạn nhưng gọi refresh token bị fail
                    // thì tiến hành xóa local storage và toast message

                    clearLS();
                    this.accessToken = "";
                    this.refreshToken = "";
                    toast.error(
                        error.response?.data.data?.message ||
                            error.response?.data.message
                    );
                    // window.location.reload()
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return Promise.reject(error);
            }
        );
    }
    private handleRefreshToken() {
        return this.instance
            .post<RefreshTokenReponse>(URL_REFRESH_TOKEN, {
                refresh_token: this.refreshToken,
            })
            .then((res) => {
                const { access_token } = res.data.data;
                setAccessTokenToLS(access_token);
                this.accessToken = access_token;
                return access_token;
            })
            .catch((error) => {
                clearLS();
                this.accessToken = "";
                this.refreshToken = "";
                throw error;
            });
    }
}

const http = new Http().instance;
export default http;
