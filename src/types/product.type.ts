//Kiểu dữ liệu trả về của API 1 sản phẩm
export interface Product {
    _id: string;
    images: string[];
    price: number;
    rating: number;
    price_before_discount: number;
    quantity: number;
    sold: number;
    view: number;
    name: string;
    description: string;
    category: {
        _id: string;
        name: string;
    };
    image: string;
    createdAt: string;
    updatedAt: string;
}

// Kiểu dữ liệu trả về của API danh sách sản phẩm
export interface ProductList {
    products: Product[];
    pagination: {
        page: number;
        limit: number;
        page_size: number;
    };
}
//kiểu dữ liệu của các params truyền vào API
export interface ProductListConfig {
    page?: number | string;
    limit?: number | string;
    sort_by?: "createdAt" | "view" | "sold" | "price";
    order?: "asc" | "desc";
    exclude?: string;
    rating_filter?: number | string;
    price_max?: number | string;
    price_min?: number | string;
    name?: string;
    category?: string;
}
