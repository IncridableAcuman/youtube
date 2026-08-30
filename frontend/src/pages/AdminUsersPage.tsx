import { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminUsersPage() {
    const {
        usersData,
        loadingUsers,
        searchQuery,
        page,
        setSearchQuery,
        setPage,
        fetchUsers,
        deleteUser,
    } = useAdminStore();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Foydalanuvchilar Boshqaruvi</h1>
                    <p className="text-xs text-zinc-500 mt-1">Foydalanuvchilar ro'yxati, rol va o'chirish amallari</p>
                </div>

                {/* Qidiruv Input */}
                <input
                    type="text"
                    placeholder="Ism yoki email bo'yicha qidiruv..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
            </div>

            {/* Jadval */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                {loadingUsers ? (
                    <div className="p-12 text-center text-zinc-500 text-sm">Foydalanuvchilar yuklanmoqda...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase font-bold text-zinc-400 border-b dark:border-zinc-800">
                            <th className="p-4">Foydalanuvchi</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                        {usersData?.content?.length ? (
                            usersData.content.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center font-bold text-xs uppercase">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.username?.[0] || "U"
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{user.fullName || user.username}</p>
                                            <p className="text-xs text-zinc-400">@{user.username}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-zinc-500">{user.email}</td>
                                    <td className="p-4">
                      <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                              user.role === "ADMIN"
                                  ? "bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                      >
                        {user.role}
                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => {
                                                if (confirm("Ushbu foydalanuvchini o'chirishni tasdiqlaysizmi?")) {
                                                    deleteUser(user.id);
                                                }
                                            }}
                                            className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-600 rounded-lg text-xs font-semibold transition"
                                        >
                                            O'chirish
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-zinc-400 text-sm">
                                    Foydalanuvchilar topilmadi
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}

                {/* Paginatsiya */}
                {usersData && usersData.totalPages > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-400">
              Sahifa {page + 1} / {usersData.totalPages}
            </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold disabled:opacity-50"
                            >
                                Oldingi
                            </button>
                            <button
                                disabled={page + 1 >= usersData.totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-semibold disabled:opacity-50"
                            >
                                Keyingi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}