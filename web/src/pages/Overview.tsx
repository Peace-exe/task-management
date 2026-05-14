import { Users, BookOpen, UserCheck, Clock } from "lucide-react";

const stats = [
  { label: "Total Students", value: "248", icon: Users },
  { label: "Active Courses", value: "12", icon: BookOpen },
  { label: "Present Today", value: "231", icon: UserCheck },
  { label: "On Leave", value: "17", icon: Clock },
];

const Overview = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">Quick summary of your institution.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-background p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <stat.icon size={16} className="text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
