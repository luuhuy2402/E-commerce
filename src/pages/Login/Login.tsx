import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema, Schema } from "../../utils/rules";
import { useMutation } from "@tanstack/react-query";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { ErrorResponse } from "../../types/utils.type";
import Input from "../../components/Input";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import Button from "../../components/Button";
import authApi from "../../apis/auth.api";
import { Helmet } from "react-helmet-async";

type FormData = Pick<Schema, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

export default function Login() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const {
        register,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: (body: Omit<FormData, "confirm_password">) =>
            authApi.login(body),
    });

    const onSubmit = handleSubmit((data) => {
        // console.log("data", data);
        loginMutation.mutate(data, {
            onSuccess: (data) => {
                console.log("data", data);
                setIsAuthenticated(true);
                setProfile(data.data.data.user);
                navigate("/");
            },
            onError: (error) => {
                if (
                    isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(
                        error
                    )
                ) {
                    const formError = error.response?.data.data;
                    if (formError) {
                        Object.keys(formError).forEach((key) => {
                            setError(key as keyof FormData, {
                                message: formError[key as keyof FormData],
                                type: "Server",
                            });
                        });
                    }
                }
            },
        });
    });
    // console.log(errors);
    // const valuePassword = watch("password");

    return (
        <div className="bg-orange">
            <Helmet>
                <title>Đăng nhập | E-commerce</title>
                <meta name="description" content="Đăng nhập vào dự án" />
            </Helmet>
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
                    <div className="lg:col-span-2 lg:col-start-4">
                        <form
                            className="p-10 rounded bg-white shadow-sm"
                            onSubmit={onSubmit}
                            noValidate
                        >
                            <div className="text-2xl">Đăng nhập</div>

                            <Input
                                name="email"
                                register={register}
                                type="email"
                                className="mt-8"
                                errorMessage={errors.email?.message}
                                placeholder="Email"
                            />
                            <Input
                                name="password"
                                register={register}
                                type="password"
                                className="mt-2"
                                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                                errorMessage={errors.password?.message}
                                placeholder="Password"
                                autoComplete="on"
                            />

                            <div className="mt-3">
                                <Button
                                    type="submit"
                                    className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center"
                                    isLoading={loginMutation.isLoading}
                                    disabled={loginMutation.isLoading}
                                >
                                    Đăng nhập
                                </Button>
                            </div>
                            <div className="flex items-center justify-center mt-8">
                                <span className="text-gray-400">
                                    Bạn chưa có tài khoản?
                                </span>
                                <Link
                                    className="text-red-400 ml-1"
                                    to="/register"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
