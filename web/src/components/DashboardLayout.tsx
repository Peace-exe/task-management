import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import useTaskStore from "../store/useTaskStore";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/" },
  { label: "Tasks", icon: CheckSquare, path: "/students" },
  { label: "Account", icon: User, path: "/account" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const clearTasks = useTaskStore((state) => state.clearTasks);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:7001/logout", {}, { withCredentials: true });
    } catch {
      // even if API fails, clear local state anyway
    } finally {
      clearUser();
      clearTasks(); // clears tasks + localStorage via persist middleware
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 border-r border-border bg-background flex flex-col p-4 gap-8 transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
            <span className="font-semibold tracking-tight">{`${user?.firstName} ${user?.lastName}`}</span>
          </div>
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all ${
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </aside>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-border px-4 lg:px-8">
          <button
            className="lg:hidden text-muted-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
        </header>
        <section className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </section>
      </div>
    </div>
  );
};

export default DashboardLayout;