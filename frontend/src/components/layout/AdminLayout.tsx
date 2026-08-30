import { NavLink, Outlet, Link } from "react-router-dom";

export const AdminLayout = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            isActive
                ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100">
            <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <span className="text-2xl font-black text-red-600 tracking-tight">Studio</span>
                        <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 font-bold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
              ADMIN
            </span>
                    </div>

                    <nav className="space-y-1.5">
                        <NavLink to="/admin/dashboard" className={navLinkClass}>
                            📊 Dashboard
                        </NavLink>
                        <NavLink to="/admin/users" className={navLinkClass}>
                            👥 Foydalanuvchilar
                        </NavLink>
                        <NavLink to="/admin/videos" className={navLinkClass}>
                            🎬 Videolar
                        </NavLink>
                        <NavLink to="/admin/channels" className={navLinkClass}>
                            📢 Kanallar
                        </NavLink>
                        <NavLink to="/admin/comments" className={navLinkClass}>
                            💬 Izohlar Moderatsiyasi
                        </NavLink>
                    </nav>
                </div>

                <Link
                    to="/"
                    className="flex items-center justify-center gap-2 p-3 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800/50 rounded-xl transition"
                >
                    ← Asosiy Platformaga Qaytish
                </Link>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};