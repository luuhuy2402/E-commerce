import { useQuery } from "@tanstack/react-query";
import productApi from "../../apis/product.api";
import Pagination from "../../components/Pagination";
import { ProductListConfig } from "../../types/product.type";
import categoryApi from "../../apis/category.api";
import AsideFilter from "./components/AsideFilter";
import SortProductList from "./components/SortProductList";
import Product from "./components/Product";
import useQueryConfig from "../../hooks/useQueryConfig";
import { Helmet } from "react-helmet-async";

export default function ProductList() {
    const queryConfig = useQueryConfig();

    const { data: productsData } = useQuery({
        queryKey: ["products", queryConfig],
        queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
        keepPreviousData: true,
        staleTime: 3 * 60 * 1000,
    });

    const { data: categoriesData } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return categoryApi.getCategories();
        },
    });

    return (
        <div className="bg-gray-200 py-6">
            <Helmet>
                <title>Trang chủ | E-commerce</title>
                <meta name="description" content="Trang chủ dự án" />
            </Helmet>
            <div className="container">
                {productsData && (
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <AsideFilter
                                queryConfig={queryConfig}
                                categories={categoriesData?.data.data || []}
                            />
                        </div>
                        <div className="col-span-9">
                            <SortProductList
                                queryConfig={queryConfig}
                                pageSize={
                                    productsData.data.data.pagination.page_size
                                }
                            />
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {productsData.data.data.products.map(
                                    (product) => (
                                        <div
                                            className="col-span-1"
                                            key={product._id}
                                        >
                                            <Product product={product} />
                                        </div>
                                    )
                                )}
                            </div>
                            <Pagination
                                queryConfig={queryConfig}
                                pageSize={
                                    productsData.data.data.pagination.page_size
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
