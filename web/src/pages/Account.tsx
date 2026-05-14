import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Camera } from "lucide-react";
import axios from "axios";
import useAuthStore from "../store/useAuthStore";
import { toast } from "../hooks/use-toast";

const Account = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [about, setAbout] = useState(user?.about ?? "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const updates: Record<string, string> = {};

    if (firstName !== user?.firstName) updates.firstName = firstName;
    if (lastName !== user?.lastName) updates.lastName = lastName;
    if (email !== user?.email) updates.email = email;
    if (about !== user?.about) updates.about = about;

    if (Object.keys(updates).length === 0) {
      toast({ title: "No changes", description: "Nothing was updated." });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:7001/profile/update", updates,{withCredentials: true});
      setUser({ ...user, ...res.data.data });
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.response?.data?.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your profile details.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start sm:gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarImage src="" alt={fullName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                {fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-foreground/40 text-background opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={20} />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1 pt-1">
            <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <span className="inline-block mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Faculty
            </span>
          </div>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-all resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;