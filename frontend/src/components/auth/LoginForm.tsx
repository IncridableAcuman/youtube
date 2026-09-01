import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { type LoginInput, loginSchema } from "@/lib/validations/auth";
import { api } from "@/api.axio";

export const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const response = await api.post("/auth/login", data);
            setAuth(response.data.accessToken, response.data.id);

            const userRes = await api.get("/users/me");
            useAuthStore.getState().setUser(userRes.data);

            navigate("/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Email yoki parol noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
                <div className="p-3 text-xs rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 ml-1">Email</label>
                <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-medium text-zinc-300">Parol</label>
                </div>
                <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-xs shadow-lg shadow-red-600/20 disabled:opacity-50 active:scale-[0.99]"
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <>
                        Tizimga kirish <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-zinc-400 pt-3">
                Hisobingiz yo'qmi?{" "}
                <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold transition">
                    Ro'yxatdan o'ting
                </Link>
            </p>
        </form>
    );
};