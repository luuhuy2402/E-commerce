import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Schema, schema } from "../../utils/rules";
import Input from "../../components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import omit from "lodash/omit";
import { ErrorResponse } from "../../types/utils.type";
import { isAxiosUnprocessableEntityError } from "../../utils/utils";
import { useContext } from "react";
import { AppContext } from "../../contexts/app.context";
import Button from "../../components/Button";
import authApi from "../../apis/auth.api";

type FormData = Pick<Schema, "email" | "password" | "confirm_password">;
const registerSchema = schema.pick(["email", "password", "confirm_password"]);

export default function Register() {
    const { setIsAuthenticated, setProfile } = useContext(AppContext);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema),
    });

    const registerAccountMutation = useMutation({
        mutationFn: (body: Omit<FormData, "confirm_password">) =>
            authApi.registerAccount(body),
    });

    const onSubmit = handleSubmit((data) => {
        const body = omit(data, ["confirm_password"]);
        registerAccountMutation.mutate(body, {
            onSuccess: (data) => {
                setIsAuthenticated(true);
                setProfile(data.data.data.user);
                navigate("/");
            },
            onError: (error) => {
                if (
                    isAxiosUnprocessableEntityError<
                        ErrorResponse<Omit<FormData, "confirm_password">>
                    >(error)
                ) {
                    const formError = error.response?.data.data;
                    if (formError?.email) {
                        setError("email", {
                            message: formError.email,
                            type: "Server",
                        });
                    }
                    if (formError?.password) {
                        setError("password", {
                            message: formError.password,
                            type: "Server",
                        });
                    }
                }
            },
        });
    });

    return (
        <div className="bg-orange">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10">
                    <div className="lg:col-span-2 lg:col-start-4">
                        <form
                            className="p-10 rounded bg-white shadow-sm"
                            onSubmit={onSubmit}
                            noValidate
                        >
                            <div className="text-2xl">Đăng ký</div>

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
                                errorMessage={errors.password?.message}
                                placeholder="Password"
                                autoComplete="on"
                            />

                            <Input
                                name="confirm_password"
                                register={register}
                                type="password"
                                className="mt-2"
                                errorMessage={errors.confirm_password?.message}
                                placeholder="Confirm Password"
                                autoComplete="on"
                            />
                            <div className="mt-2">
                                <Button
                                    type="submit"
                                    className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center"
                                    isLoading={
                                        registerAccountMutation.isLoading
                                    }
                                    disabled={registerAccountMutation.isLoading}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                            <div className="flex items-center justify-center mt-8">
                                <span className="text-gray-400">
                                    Bạn đã có tài khoản?
                                </span>
                                <Link className="text-red-400 ml-1" to="/login">
                                    Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
