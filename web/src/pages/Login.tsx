import { useState } from "react";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import useAuthStore from "../store/useAuthStore";



const Login = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");

  const setUser = useAuthStore((state) => state.setUser);
  const { toast } = useToast();

  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:7001/auth/login", { email, password }, { withCredentials: true });
      setUser(res.data.data);
      
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regFirstName || !regLastName || !regEmail || !regPassword || !regConfirmPassword) {
      setError("Please fill in all fields."); return;
    }
    if (regPassword !== regConfirmPassword) { setError("Passwords do not match."); return; }
    if (regPassword.length < 6) { setError("Password must be at least 6 characters."); return; }

    try {
      setLoading(true);
      await axios.post("http://localhost:7001/auth/signup", {
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
      }, { withCredentials: true });

      toast({ title: "Account created", description: "You can now sign in with your credentials." });
      setEmail(regEmail);
      setRegFirstName(""); setRegLastName(""); setRegEmail(""); setRegPassword(""); setRegConfirmPassword("");
      setMode("login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="w-full max-w-sm space-y-8 px-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {mode === "login" ? "Sign in to Faculty" : "Create an account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Student management system</p>
          </div>
        </div>

        {mode === "login" ? (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@faculty.edu" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button type="button" onClick={() => { setMode("register"); setError(""); }} className="font-medium text-primary hover:underline">Create an account</button>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleRegister} className="space-y-4">
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <input type="text" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} placeholder="John" className={inputClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <input type="text" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} placeholder="Doe" className={inputClass} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="teacher@faculty.edu" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <input type="password" value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => { setMode("login"); setError(""); }} className="font-medium text-primary hover:underline">Sign in</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;