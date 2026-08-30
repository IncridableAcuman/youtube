import React, { useEffect } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { Loader2, Ban, CheckCircle } from "lucide-react";

export const AdminChannelsPage: React.FC = () => {
    const { channels, fetchChannels, toggleChannelStatus, loading } = useAdminStore();

    useEffect(() => {
        fetchChannels();
    }, [fetchChannels]);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Kanallar Moderatsiyasi</h1>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                </div>
            ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-zinc-300">
                        <thead className="bg-zinc-950 text-xs text-zinc-400 uppercase border-b border-zinc-800">
                        <tr>
                            <th className="p-4">Kanal Nomi</th>
                            <th className="p-4">Taxallus</th>
                            <th className="p-4">Obunachilar</th>
                            <th className="p-4">Holat</th>
                            <th className="p-4 text-right">Amallar</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                        {channels.map((channel) => (
                            <tr key={channel.id} className="hover:bg-zinc-800/40 transition">
                                <td className="p-4 font-semibold text-white">{channel.name}</td>
                                <td className="p-4 text-zinc-400">{channel.handle}</td>
                                <td className="p-4 text-zinc-400">{channel.subscribersCount.toLocaleString()}</td>
                                <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                            channel.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                                        }`}>
                                            {channel.status}
                                        </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleChannelStatus(channel.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ml-auto ${
                                            channel.status === "BANNED" ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white"
                                        }`}
                                    >
                                        {channel.status === "BANNED" ? <CheckCircle className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                        {channel.status === "BANNED" ? "Aktivlashtirish" : "Bloklash"}
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