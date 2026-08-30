import React, { useEffect, useState } from "react";
import { useAdminStore, type AdminUser } from "@/store/useAdminStore";
import { Loader2, ShieldAlert, ShieldCheck, Search } from "lucide-react";

export const AdminUsersPage: React.FC = () => {
    const { users, fetchUsers, toggleUserBan, changeUserRole, loading } = useAdminStore();
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter((u) =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight">Foydalanuvchilar Moderatsiyasi</h1>
                <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Qidiruv..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 focus:outline-none focus:border-red-600"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-xs text-zinc-400 uppercase border-b border-zinc-800">
                        <tr>
                            <th className="p-4">Foydalanuvchi</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4">Holat</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-800/40 transition">
                                <td className="p-4 font-semibold text-white">{user.fullName} (@{user.username})</td>
                                <td className="p-4 text-zinc-400">{user.email}</td>
                                <td className="p-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeUserRole(user.id, e.target.value as AdminUser["role"])}
                                        className="bg-zinc-950 border border-zinc-800 text-xs rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-red-600"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="MODERATOR">MODERATOR</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${user.banned ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
                                            {user.banned ? "BLOKLANGAN" : "FAOL"}
                                        </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleUserBan(user.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ml-auto ${user.banned ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white"}`}
                                    >
                                        {user.banned ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                                        {user.banned ? "Plokdan chiqarish" : "Bloklash"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};