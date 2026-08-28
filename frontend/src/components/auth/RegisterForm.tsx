import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { User, AtSign, Lock, UserCheck, Loader2, ArrowRight } from "lucide-react";
import {type RegisterInput, registerSchema} from "@/lib/validations/auth.ts";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {api} from "@/api.axio.ts";

export const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const response = await api.post("/auth/register", data);
            localStorage.setItem("accessToken",response.data.accessToken);
            setAuth(response.data.accessToken, response.data.id);
            navigate("/");
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {errorMsg && (
                <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    {errorMsg}
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">To'liq ism</label>
                <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("fullName")}
                        placeholder="John Doe"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 mt-0.5">{errors.fullName.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Username</label>
                <div className="relative">
                    <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("username")}
                        placeholder="johndoe"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.username && <p className="text-xs text-red-500 mt-0.5">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Email</label>
                <div className="relative">
                    <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Parol</label>
                <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-red-600/25 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Ro'yxatdan o'tish <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-xs text-zinc-400 pt-2">
                Akkountingiz bormi?{" "}
                <Link to="/login" className="text-red-500 hover:underline font-medium">
                    Kirish
                </Link>
            </p>
        </form>
    );
};