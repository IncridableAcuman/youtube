import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Play,
    Search,
    Video,
    Bell,
    LogOut,
    Shield,
    Loader2,
    Menu,
    PlusCircle,
    Tv,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useChannelStore } from "@/store/useChannelStore";
import { CreateChannelModal } from "@/components/channel/CreateChannelModal";
import { api } from "@/api.axio";

export const Header: React.FC = () => {
    const { user, clearAuth } = useAuthStore();
    const { toggleSidebar } = useSidebarStore();
    const { myChannel, fetchMyChannel, loading: channelLoading } = useChannelStore();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyChannel();
    }, [fetchMyChannel]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout qilishda xatolik:", error);
        } finally {
            clearAuth();
            setIsLoggingOut(false);
            navigate("/login");
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-50 h-14 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-zinc-800/60 rounded-full text-zinc-300 transition focus:outline-none active:scale-95"
                    title="Menyu"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <Link to="/" className="flex items-center gap-2 select-none">
                    <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white hidden sm:inline">
                        YouTube <span className="text-xs font-normal text-red-500">UZ</span>
                    </span>
                </Link>
            </div>

            <form
                onSubmit={handleSearch}
                className="flex-1 max-w-2xl mx-4 hidden md:flex items-center"
            >
                <div className="flex w-full items-center">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Qidiruv..."
                        className="w-full bg-zinc-900/80 border border-zinc-800 rounded-l-full px-4 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-red-600 transition"
                    />
                    <button
                        type="submit"
                        className="bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-800 px-5 py-1.5 rounded-r-full text-zinc-300 transition"
                        title="Qidirish"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </form>

            <div className="flex items-center gap-2 sm:gap-3">
                <Link
                    to="/my-videos"
                    className="p-2 hover:bg-zinc-800/80 rounded-full text-zinc-300 transition"
                    title="Videolaringiz"
                >
                    <Video className="w-5 h-5" />
                </Link>

                <button
                    className="p-2 hover:bg-zinc-800/80 rounded-full text-zinc-300 transition"
                    title="Bildirishnomalar"
                >
                    <Bell className="w-5 h-5" />
                </button>

                <div className="relative ml-2" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-9 h-9 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-semibold text-xs border-2 border-zinc-800 hover:border-zinc-500 transition focus:outline-none"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.fullName || "User"}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            getInitials(user?.fullName || user?.username)
                        )}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl py-2 z-50 text-zinc-200 divide-y divide-zinc-800">
                            <div className="px-4 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName || "User"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user?.fullName || user?.username)
                                    )}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-semibold text-sm text-white truncate">
                                        {user?.fullName || "Foydalanuvchi"}
                                    </p>
                                    <p className="text-xs text-zinc-400 truncate">
                                        @{user?.username || "username"}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                                        {user?.email || ""}
                                    </p>
                                </div>
                            </div>

                            <div className="py-1">
                                {channelLoading ? (
                                    <div className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-400">
                                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                        Yuklanmoqda...
                                    </div>
                                ) : myChannel ? (
                                    <Link
                                        to={`/channel/${myChannel.id}`}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800/80 text-zinc-300 transition"
                                    >
                                        <Tv className="w-4 h-4 text-zinc-400" />
                                        Kanalingiz
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            setIsCreateChannelOpen(true);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800/80 text-red-400 font-medium transition"
                                    >
                                        <PlusCircle className="w-4 h-4 text-red-500" />
                                        Kanal yaratish
                                    </button>
                                )}

                                <Link
                                    to="/my-videos"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-zinc-800/80 text-zinc-300 transition"
                                >
                                    <Shield className="w-4 h-4 text-zinc-400" />
                                    Boshqaruv Paneli
                                </Link>
                            </div>

                            <div className="py-1">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                                >
                                    {isLoggingOut ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                    ) : (
                                        <LogOut className="w-4 h-4 text-red-500" />
                                    )}
                                    Tizimdan chiqish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateChannelModal
                isOpen={isCreateChannelOpen}
                onClose={() => setIsCreateChannelOpen(false)}
            />
        </header>
    );
};