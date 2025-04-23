import { Navigate, Outlet, useRoutes } from "react-router-dom";
// import ProductList from "./pages/ProductList";
import RegisterLayout from "./layouts/RegisterLayout";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import { lazy, Suspense, useContext } from "react";
import { AppContext } from "./contexts/app.context";
import path from "./constants/path";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
import CartLayout from "./layouts/CartLayout.tsx";
// import ChangePassword from "./pages/User/pages/ChangePassword/ChangePassword.tsx";
import UserLayout from "./pages/User/layouts/UserLayout/UserLayout.tsx";
// import Profile from "./pages/User/pages/Profile/Profile.tsx";
// import HistoryPurchase from "./pages/User/pages/HistoryPurchase/HistoryPurchase.tsx";
import NotFound from "./pages/NotFound/NotFound.tsx";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProductList = lazy(() => import("./pages/ProductList"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const ChangePassword = lazy(
    () => import("./pages/User/pages/ChangePassword/ChangePassword")
);
const Profile = lazy(() => import("./pages/User/pages/Profile/Profile"));
const HistoryPurchase = lazy(
    () => import("./pages/User/pages/HistoryPurchase/HistoryPurchase")
);
function ProtectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
    const { isAuthenticated } = useContext(AppContext);
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
export default function useRouteElements() {
    const routeElements = useRoutes([
        {
            path: "",
            element: <RejectedRoute />,
            children: [
                {
                    path: path.login,
                    element: (
                        <RegisterLayout>
                            <Suspense>
                                <Login />
                            </Suspense>
                        </RegisterLayout>
                    ),
                },
                {
                    path: path.register,
                    element: (
                        <RegisterLayout>
                            <Suspense>
                                <Register />
                            </Suspense>
                        </RegisterLayout>
                    ),
                },
            ],
        },
        {
            path: "",
            element: <ProtectedRoute />,
            children: [
                {
                    path: path.cart,
                    element: (
                        <CartLayout>
                            <Suspense>
                                <Cart />
                            </Suspense>
                        </CartLayout>
                    ),
                },
                {
                    path: path.user,
                    element: (
                        <MainLayout>
                            <UserLayout />
                        </MainLayout>
                    ),
                    children: [
                        {
                            path: path.profile,
                            element: (
                                <Suspense>
                                    <Profile />
                                </Suspense>
                            ),
                        },
                        {
                            path: path.changePassword,
                            element: (
                                <Suspense>
                                    <ChangePassword />
                                </Suspense>
                            ),
                        },
                        {
                            path: path.historyPurchase,
                            element: (
                                <Suspense>
                                    <HistoryPurchase />
                                </Suspense>
                            ),
                        },
                    ],
                },
            ],
        },
        {
            path: path.productDetail,

            element: (
                <MainLayout>
                    <Suspense>
                        <ProductDetail />
                    </Suspense>
                </MainLayout>
            ),
        },
        {
            path: "",
            index: true,
            element: (
                <MainLayout>
                    <Suspense>
                        <ProductList />
                    </Suspense>
                </MainLayout>
            ),
        },
        {
            path: "*",
            index: true,
            element: (
                <MainLayout>
                    <NotFound />
                </MainLayout>
            ),
        },
    ]);
    return routeElements;
}
