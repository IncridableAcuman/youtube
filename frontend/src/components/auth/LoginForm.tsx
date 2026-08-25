import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, Loader2, ArrowRight } from "lucide-react";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {type LoginInput, loginSchema} from "@/lib/validations/auth.ts";
import {api} from "@/api.axio.ts";

export const LoginForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
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
            // 1. Login qilish
            const response = await api.post("/auth/login", data);
            setAuth(response.data.accessToken, response.data.id);

            // 2. Profil ma'lumotlarini yuklash
            const userRes = await api.get("/users/me");
            useAuthStore.getState().setUser(userRes.data);

            // 3. Asosiy sahifaga yo'naltirish
            navigate("/");
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Tizimga kirishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMsg && (
                <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {errorMsg}
                </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email</label>
                <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Parol</label>
                <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/25 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Kirish <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-xs text-zinc-400 pt-4">
                Hisobingiz yo'qmi?{" "}
                <Link to="/register" className="text-red-500 hover:underline font-medium">
                    Ro'yxatdan o'ting
                </Link>
            </p>
        </form>
    );
};