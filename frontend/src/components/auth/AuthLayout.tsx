import React from "react";
import { Play, Tv, ShieldCheck, Flame } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl shadow-2xl overflow-hidden relative z-10">

                {/* Chap tomon: Branding va Visual */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-zinc-900/90 via-zinc-900/40 to-red-950/20 border-r border-zinc-800/60 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                        <span className="text-xl font-bold tracking-wider">YouTube <span className="text-red-5 font-normal text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full border border-red-500/20">Studio</span></span>
                    </div>

                    <div className="space-y-6 my-auto">
                        <h1 className="text-4xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                            Cheksiz videolar olamiga hush kelibsiz.
                        </h1>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            O'z kanalingizni yarating, sevimli kontentlaringizni ulashing va millionlab ijodkorlar hamjamiyatiga qo'shiling.
                        </p>

                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <Tv className="w-4 h-4 text-red-500" /> 4K Ultra HD formatda sifatli strimlar
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <Flame className="w-4 h-4 text-red-500" /> Shaxsiy tavsiyalar algoritm
                            </div>
                            <div className="flex items-center gap-3 text-sm text-zinc-300">
                                <ShieldCheck className="w-4 h-4 text-red-500" /> Maxfiylik va yuqori xavfsizlik
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-zinc-500">
                        © 2026 YouTube Clone Platform. Barcha huquqlar himoyalangan.
                    </div>
                </div>

                {/* O'ng tomon: Form qismi */}
                <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <div className="mb-8 space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
                        <p className="text-sm text-zinc-400">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};