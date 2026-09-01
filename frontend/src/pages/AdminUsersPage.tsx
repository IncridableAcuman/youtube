// src/pages/admin/AdminUsersPage.tsx
import React, { useEffect, useState } from "react";
import { useAdminStore, type AdminUser } from "@/store/useAdminStore";
import {
    Loader2,
    ShieldAlert,
    ShieldCheck,
    Search,
    Users,
    UserX,
    Mail,
} from "lucide-react";

export const AdminUsersPage: React.FC = () => {
    const { users, fetchUsers, toggleUserBan, changeUserRole, loading } = useAdminStore();
    const [search, setSearch] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleBan = async (userId: string) => {
        setActionLoadingId(userId);
        try {
            await toggleUserBan(userId);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleChangeRole = async (userId: string, role: AdminUser["role"]) => {
        setActionLoadingId(userId);
        try {
            await changeUserRole(userId, role);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Qidiruv filtri (ism, taxallus va email bo'yicha)
    const filteredUsers = users.filter((u) => {
        const query = search.toLowerCase();
        return (
            u.fullName.toLowerCase().includes(query) ||
            u.username.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header va Qidiruv Paneli */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-zinc-900 dark:text-white">
                        <Users className="w-6 h-6 text-red-600" />
                        Foydalanuvchilar Moderatsiyasi
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Platforma foydalanuvchilarini boshqarish, rollarni biriktirish va kirishni cheklash
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 md:w-72">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Ism, taxallus yoki email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition shadow-sm"
                        />
                    </div>
                    <div className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0 shadow-sm">
                        Jami: <span className="text-red-600 font-bold">{filteredUsers.length}</span> ta
                    </div>
                </div>
            </div>

            {/* Asosiy Tarkib */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <p className="text-xs font-medium text-zinc-500">Foydalanuvchilar yuklanmoqda...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-600 mb-4 shadow-inner">
                        <UserX className="w-7 h-7" />
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
                        {search ? "Qidiruv bo'yicha foydalanuvchi topilmadi" : "Foydalanuvchilar mavjud emas"}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                        {search
                            ? "Kiritilgan kalit so'z bo'yicha hech qanday foydalanuvchi topilmadi."
                            : "Tizimda ro'yxatdan o'tgan foydalanuvchilar yo'q."}
                    </p>
                </div>
            ) : (
                /* Jadval */
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm transition">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                                <tr>
                                    <th className="py-3.5 px-5">Foydalanuvchi</th>
                                    <th className="py-3.5 px-5">Email</th>
                                    <th className="py-3.5 px-5">Rol</th>
                                    <th className="py-3.5 px-5">Holat</th>
                                    <th className="py-3.5 px-5 text-right">Amallar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                                {filteredUsers.map((user) => {
                                    const isUpdating = actionLoadingId === user.id;
                                    const initial = user.fullName ? user.fullName.slice(0, 2).toUpperCase() : "U";

                                    return (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group"
                                        >
                                            {/* Foydalanuvchi avatari va nomi */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-red-600/10 dark:bg-red-500/10 border border-red-500/20 flex items-center justify-center font-bold text-xs text-red-600 dark:text-red-400 shrink-0 overflow-hidden">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.fullName}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            initial
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                                                            {user.fullName}
                                                        </span>
                                                        <span className="text-[11px] text-zinc-400 font-mono">
                                                            @{user.username}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-medium">
                                                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                                                    {user.email}
                                                </div>
                                            </td>

                                            {/* Rol Tanlash */}
                                            <td className="py-4 px-5">
                                                <div className="relative inline-block">
                                                    <select
                                                        value={user.role}
                                                        disabled={isUpdating}
                                                        onChange={(e) =>
                                                            handleChangeRole(user.id, e.target.value as AdminUser["role"])
                                                        }
                                                        className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-red-600/30 focus:border-red-600 transition shadow-sm disabled:opacity-50 cursor-pointer"
                                                    >
                                                        <option value="USER">USER</option>
                                                        <option value="MODERATOR">MODERATOR</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-5">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                        user.banned
                                                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                            : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                                    }`}
                                                >
                                                    {user.banned ? "BLOKLANGAN" : "FAOL"}
                                                </span>
                                            </td>

                                            {/* Amallar */}
                                            <td className="py-4 px-5 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleBan(user.id)}
                                                    disabled={isUpdating}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition inline-flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 ml-auto ${
                                                        user.banned
                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            : "bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20"
                                                    }`}
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : user.banned ? (
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <ShieldAlert className="w-3.5 h-3.5" />
                                                    )}
                                                    {user.banned ? "Blokdan chiqarish" : "Bloklash"}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};