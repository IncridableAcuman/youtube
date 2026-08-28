import React, { useState } from "react";
import { X, Tv, Loader2 } from "lucide-react";
import { api } from "@/api.axio";
import type { Channel } from "@/types/channel";

interface CreateChannelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (channel: Channel) => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
                                                                          isOpen,
                                                                          onClose,
                                                                          onSuccess,
                                                                      }) => {
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError("");

        try {
            const res = await api.post<Channel>("/channels", {
                name,
                handle,
                description,
            });
            onSuccess(res.data);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Kanal yaratishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-zinc-100 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full text-zinc-400 hover:bg-zinc-800 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20">
                        <Tv className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">Kanal Yaratish</h2>
                        <p className="text-xs text-zinc-400">Videolaringizni ulashish uchun kanal oching</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Kanal nomi *
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masalan: My Tech Channel"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Kanal taxallusi (Handle)
                        </label>
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="@mytechchannel"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Kanal haqida
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Kanalingiz mazmuni haqida qisqacha..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:bg-zinc-800 transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-medium transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            Yaratish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};