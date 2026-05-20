import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import TodoPage from "./pages/TaskPage";
import Account from "./pages/Account";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";
import useAuthStore from "./store/useAuthStore";
import axios from "axios";

const queryClient = new QueryClient();

const App = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check 1: token in cookie
        const token = document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith("token="))?.split("=")[1];
        if (!token) { clearUser(); return; }

        // Check 2: verify token via API
        await axios.get("http://localhost:7001/profile/validateToken", { withCredentials: true });
      } catch {
        clearUser();
      } finally {
        setAuthChecked(true);
      }
    };

    validateAuth();
  }, []);

  // spinner on initial load only
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Check 3: store must have user — this now reactively updates when setUser is called
  if (!user) {
    return <Login />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              
              <Route index path="/" element={<TodoPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;