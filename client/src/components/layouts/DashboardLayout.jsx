import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import menus from "../../utils/menus";
import MiniAiWidget from "./MiniAiWidget"; 

export default function DashboardLayout({ role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Use dynamic role from props
  const menu = menus?.[role] ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} menu={menu} role={role} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} role={role} />
        <main className="p-6 flex-1 overflow-y-auto bg-[#ffefd3] ">
          {/* Render the nested page */}
          <Outlet />
        </main>
      </div>
      <MiniAiWidget />
    </div>
  );
}
