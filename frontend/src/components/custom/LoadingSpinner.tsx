import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-sm font-medium">Tizimga ulanmoqda...</p>
    </div>
);