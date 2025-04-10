import axios, { AxiosError } from "axios";
import HttpStatusCode from "../constants/httpStatusCode.enum";

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
