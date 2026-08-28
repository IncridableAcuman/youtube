import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Tv, Loader2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChannelStore } from "@/store/useChannelStore";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateChannelModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [handle, setHandle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { createChannel } = useChannelStore();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError("");

        try {
            const newChannel = await createChannel({
                name: name.trim(),
                handle: handle.trim() || `@${name.toLowerCase().replace(/\s+/g, "")}`,
                description: description.trim(),
            });

            onClose();
            navigate(`/channel/${newChannel.id}`);
        } catch (err: any) {
            setError(err.message || "Kanal yaratishda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 relative shadow-2xl max-h-[90vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4 shrink-0">
                    <div className="p-3 bg-red-600/10 text-red-500 rounded-2xl border border-red-500/20">
                        <Tv className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Kanal yaratish</h2>
                        <p className="text-xs text-zinc-400">Tashqi ko'rinishingiz va kanalingiz ma'lumotlari</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs shrink-0">
                        {error}
                    </div>
                )}

                <div className="flex flex-col items-center justify-center py-3 mb-4 bg-zinc-950/60 rounded-2xl border border-zinc-800/80 shrink-0">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center text-zinc-400 mb-1 overflow-hidden">
                        <User className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300 truncate max-w-[200px]">
                        {name || "Kanal Nomi"}
                    </span>
                    <span className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                        {handle || "@taxallus"}
                    </span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1">
                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Kanal nomi <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masalan: Fullstack Uz"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Taxallus (Handle)
                        </label>
                        <input
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="@fullstackuz"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-zinc-400 mb-1">
                            Kanal tavsifi
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Kanalingiz haqida qisqacha..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800/80">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Kanal Yaratish
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};