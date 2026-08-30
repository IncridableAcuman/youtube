import { useState } from "react";

export default function AdminChannelsPage() {
    const [channels] = useState([
        { id: "1", name: "Code Academy", handle: "@code_academy", subscribersCount: 12400, createdAt: "2026-01-15" },
        { id: "2", name: "IT World", handle: "@it_world", subscribersCount: 8500, createdAt: "2026-03-20" },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Kanallar Boshqaruvi</h1>
                    <p className="text-xs text-zinc-500 mt-1">Platformada yaratilgan barcha kanallar va ularning statistikasi</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-[11px] uppercase font-bold text-zinc-400 border-b dark:border-zinc-800">
                        <th className="p-4">Kanal Nomi</th>
                        <th className="p-4">Handle</th>
                        <th className="p-4">Obunachilar</th>
                        <th className="p-4">Yaratilgan Sana</th>
                        <th className="p-4 text-right">Amal</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
                    {channels.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                            <td className="p-4 font-semibold">{c.name}</td>
                            <td className="p-4 text-zinc-500">{c.handle}</td>
                            <td className="p-4 font-medium">{c.subscribersCount.toLocaleString()}</td>
                            <td className="p-4 text-zinc-400 text-xs">{c.createdAt}</td>
                            <td className="p-4 text-right">
                                <button className="px-3 py-1 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-semibold transition">
                                    Bloklash
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}