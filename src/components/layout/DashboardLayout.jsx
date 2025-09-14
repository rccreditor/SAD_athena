import { Sidebar } from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}