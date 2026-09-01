import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { User, AtSign, Lock, UserCheck, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { type RegisterInput, registerSchema } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/api.axio";

export const RegisterForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            setAuth(response.data.accessToken, response.data.id);

            const userRes = await api.get("/users/me");
            useAuthStore.getState().setUser(userRes.data);

            navigate("/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {errorMsg && (
                <div className="p-3 text-xs rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 ml-1">To'liq ism</label>
                <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("fullName")}
                        placeholder="Ali Valiyev"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.fullName && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.fullName.message}</p>}
            </div>

            {/* Username */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 ml-1">Username</label>
                <div className="relative">
                    <UserCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        {...register("username")}
                        placeholder="alivaliyev"
                        className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition"
                    />
                </div>
                {errors.username && <p className="text-xs text-red-500 ml-1 mt-0.5">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
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

            {/* Password */}
            <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 ml-1">Parol</label>
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
                        Ro'yxatdan o'tish <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>

            <p className="text-center text-xs text-zinc-400 pt-2">
                Akkountingiz bormi?{" "}
                <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold transition">
                    Kirish
                </Link>
            </p>
        </form>
    );
};