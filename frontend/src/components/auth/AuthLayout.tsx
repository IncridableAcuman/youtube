import React from "react";
import { Play } from "lucide-react";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 text-zinc-100 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 -left-20 w-80 h-80 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-zinc-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
                {/* Brand Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        YouTube <span className="text-xs text-red-500 font-semibold px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20">PRO</span>
                    </span>
                </div>

                {/* Header Text */}
                <div className="text-center space-y-1 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
                    <p className="text-xs text-zinc-400">{subtitle}</p>
                </div>

                {/* Main Form Content */}
                {children}
            </div>
        </div>
    );
};