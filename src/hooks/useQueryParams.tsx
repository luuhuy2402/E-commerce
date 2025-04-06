import { useSearchParams } from "react-router-dom";

export default function useQueryParams() {
    const [searchParams] = useSearchParams(); //dùng để lấy hoặc thay đổi các tham số (query params) trên URL
    //chuyển đổi các searchParams thành một mảng các cặp key-value rồi chuyển đổi thành object
    return Object.fromEntries([...searchParams]);
}
