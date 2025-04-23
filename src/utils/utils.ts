import axios, { AxiosError } from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";
import config from "../constants/config";
import { ErrorResponse } from "../types/utils.type";

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(
    error: unknown
): error is AxiosError<FormError> {
    return (
        isAxiosError(error) &&
        error.response?.status === HttpStatusCode.UnprocessableEntity
    );
}

export function isAxiosUnauthorizedError<UnauthorizedError>(
    error: unknown
): error is AxiosError<UnauthorizedError> {
    return (
        isAxiosError(error) &&
        error.response?.status === HttpStatusCode.Unauthorized
    );
}

export function isAxiosExpiredTokenError<UnauthorizedError>(
    error: unknown
): error is AxiosError<UnauthorizedError> {
    return (
        isAxiosUnauthorizedError<
            ErrorResponse<{ name: string; message: string }>
        >(error) && error.response?.data?.data?.name === "EXPIRED_TOKEN"
    );
}

//Format lại giá
export function formatCurrency(currency: number) {
    return new Intl.NumberFormat("de-DE").format(currency);
}

//Format lượt hàng đã bán
export function formatNumberToSocialStyle(value: number) {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    })
        .format(value)
        .replace(".", ",")
        .toLowerCase();
}

//Tính tỉ lệ giá giảm
export const rateSale = (original: number, sale: number) =>
    Math.round(((original - sale) / original) * 100) + "%";

//Xoá tất cả kí tự đặc biệt
const removeSpecialCharacter = (str: string) =>
    // eslint-disable-next-line no-useless-escape
    str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        ""
    );

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
    return removeSpecialCharacter(name).replace(/\s/g, "-") + `-i-${id}`;
};

export const getIdFromNameId = (nameId: string) => {
    const arr = nameId.split("-i-");
    return arr[arr.length - 1];
};

export const getAvatarUrl = (avatarName?: string) =>
    avatarName
        ? `${config.baseUrl}images/${avatarName}`
        : "https://www.pixelstalk.net/wp-content/uploads/2016/08/Cute-Puppy-Wallpaper.jpg";
