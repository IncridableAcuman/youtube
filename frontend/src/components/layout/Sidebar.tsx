import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    Compass,
    Tv2,
    History,
    Clock,
    ThumbsUp,
    Folder,
    Settings,
    HelpCircle,
    Film,
    Gamepad2,
    Newspaper,
    Trophy,
} from "lucide-react";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
    active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={`flex items-center gap-4 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
            active
                ? "bg-zinc-800 text-white font-semibold"
                : "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
        }`}
    >
        <Icon className={`w-5 h-5 ${active ? "text-red-600" : "text-zinc-400"}`} />
        <span className="truncate">{label}</span>
    </Link>
);

export const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <aside className="w-60 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 bg-zinc-950 border-r border-zinc-800/80 overflow-y-auto p-3 hidden md:flex flex-col gap-4 text-zinc-300 select-none custom-scrollbar">
            {/* Asosiy menyu */}
            <div className="space-y-1">
                <SidebarItem icon={Home} label="Bosh sahifa" to="/" active={location.pathname === "/"} />
                <SidebarItem icon={Compass} label="Kashf etish" to="/explore" active={location.pathname === "/explore"} />
                <SidebarItem icon={Tv2} label="Obunalar" to="/subscriptions" active={location.pathname === "/subscriptions"} />
            </div>

            <hr className="border-zinc-800/80 my-1" />

            {/* Kutubxona bo'limi */}
            <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Kutubxona
                </h3>
                <SidebarItem icon={History} label="Tarix" to="/history" />
                <SidebarItem icon={Folder} label="Sizning videolaringiz" to="/my-videos" />
                <SidebarItem icon={Clock} label="Keyinroq ko'rish" to="/watch-later" />
                <SidebarItem icon={ThumbsUp} label="Yoqqan videolar" to="/liked-videos" />
            </div>

            <hr className="border-zinc-800/80 my-1" />

            {/* Kategoriyalar */}
            <div className="space-y-1">
                <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Kategoriyalar
                </h3>
                <SidebarItem icon={Gamepad2} label="O'yinlar" to="/category/gaming" />
                <SidebarItem icon={Film} label="Kino va Film" to="/category/movies" />
                <SidebarItem icon={Newspaper} label="Yangiliklar" to="/category/news" />
                <SidebarItem icon={Trophy} label="Sport" to="/category/sports" />
            </div>

            <hr className="border-zinc-800/80 my-1" />

            {/* Sozlamalar */}
            <div className="space-y-1 mt-auto">
                <SidebarItem icon={Settings} label="Sozlamalar" to="/settings" />
                <SidebarItem icon={HelpCircle} label="Yordam" to="/help" />
            </div>
        </aside>
    );
};