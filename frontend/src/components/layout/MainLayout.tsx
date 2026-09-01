import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export const MainLayout: React.FC = () => {
    return (
        <div className="h-screen bg-zinc-950 text-zinc-100 flex flex-col overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-[1800px] mx-auto w-full custom-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};