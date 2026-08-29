import { useState } from "react";
import { api } from "@/api.axio";
import { X, Upload, Clock, Type, AlignLeft, AlertCircle, Loader2, Folder, Tag } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CATEGORIES = [
    "Texnologiya",
    "Ta'lim",
    "O'yinlar",
    "Kino va Film",
    "Yangiliklar",
    "Sport",
    "Musiqa",
    "Boshqa",
];

export function UploadModal({ isOpen, onClose, onSuccess }: UploadModalProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        youtubeUrl: "",
        duration: "10:00",
        category: "Texnologiya",
        tagsInput: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const youtubeId = getYoutubeId(formData.youtubeUrl);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Vergul bilan ajratilgan teglarni massivga ajratish
        const tags = formData.tagsInput
            .split(",")
            .map((t) => t.trim().toLowerCase())
            .filter((t) => t.length > 0);

        const payload = {
            title: formData.title,
            description: formData.description,
            youtubeUrl: formData.youtubeUrl,
            duration: formData.duration,
            category: formData.category,
            tags: tags,
        };

        try {
            await api.post("/videos", payload);
            setFormData({
                title: "",
                description: "",
                youtubeUrl: "",
                duration: "10:00",
                category: "Texnologiya",
                tagsInput: "",
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Video yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Kartasi */}
            <div
                className="w-full max-w-lg rounded-2xl bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Upload className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold leading-none text-zinc-100">
                                Yangi Video Joylash
                            </h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                Kanalga yangi video va teglar yuklash
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body - Scrollable */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/40 border border-red-900/50 rounded-xl">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Sarlavha Input */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                            <Type className="w-3.5 h-3.5 text-zinc-400" /> Sarlavha
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Video sarlavhasini kiriting..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* YouTube URL Input & Preview */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                            <FaYoutube className="w-3.5 h-3.5 text-red-500" /> YouTube URL
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                        />

                        {youtubeId && (
                            <div className="mt-2 flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                                <img
                                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                                    alt="Thumbnail Preview"
                                    className="w-20 h-12 object-cover rounded-lg border border-zinc-800"
                                />
                                <div className="text-xs text-zinc-400 overflow-hidden">
                                    <p className="font-medium text-zinc-200">URL aniqlandi</p>
                                    <p className="text-[11px] text-zinc-500 truncate max-w-[240px]">{formData.youtubeUrl}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Kategoriya va Davomiyligi (2-kolonka) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                                <Folder className="w-3.5 h-3.5 text-zinc-400" /> Kategoriya
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 focus:outline-none focus:border-blue-500 transition cursor-pointer"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" /> Davomiyligi (MM:SS)
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="10:00"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    {/* Teglar (Tags) Input */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                            <Tag className="w-3.5 h-3.5 text-zinc-400" /> Teglar (vergul bilan ajratib yozing)
                        </label>
                        <input
                            type="text"
                            placeholder="java, spring boot, react, tutorial"
                            value={formData.tagsInput}
                            onChange={(e) => setFormData({ ...formData, tagsInput: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
                        />
                    </div>

                    {/* Tavsif Textarea */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-300">
                            <AlignLeft className="w-3.5 h-3.5 text-zinc-400" /> Tavsif
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Video haqida qisqacha ma'lumot..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none transition"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 disabled:opacity-50 transition"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Yuklanmoqda..." : "Joylash"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}