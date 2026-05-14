import { useState, useEffect } from "react";
import { Plus, Trash2, CircleDashed, CircleDot, CircleCheck } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import useTaskStore, { type Task } from "../store/useTaskStore";

type Status = "todo" | "in_progress" | "done";

type TaskForm = {
  title: string;
  description: string;
  status: Status;
};

const emptyForm: TaskForm = { title: "", description: "", status: "todo" };

const statusConfig: Record<
  Status,
  { label: string; icon: React.ReactNode; cardClass: string; badgeClass: string }
> = {
  todo: {
    label: "To Do",
    icon: <CircleDashed size={14} />,
    cardClass: "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/40",
    badgeClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  in_progress: {
    label: "In Progress",
    icon: <CircleDot size={14} />,
    cardClass: "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/40",
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  done: {
    label: "Done",
    icon: <CircleCheck size={14} />,
    cardClass: "border-border bg-card",
    badgeClass: "bg-secondary text-muted-foreground",
  },
};

const TodoPage = () => {
  // ── store ──────────────────────────────────────────────────────────────────
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const _hasHydrated = useTaskStore((state) => state._hasHydrated);

  // ── local UI state ─────────────────────────────────────────────────────────
  const [fetchLoading, setFetchLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<TaskForm>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");

  const { toast } = useToast();

  // ── fetch: wait for hydration, skip if localStorage already has tasks ───────
  useEffect(() => {
    if (!_hasHydrated) return;       // wait until persist has rehydrated
    if (tasks.length > 0) return;    // localStorage had data, no need to fetch

    const fetchTasks = async () => {
      try {
        setFetchLoading(true);
        const res = await axios.get("http://localhost:7001/task/getAllTasks", {
          withCredentials: true,
        });
        setTasks(res.data.data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setTasks([]);
        } else {
          toast({
            title: "Failed to load tasks",
            description: err.response?.data?.message || "Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTasks();
  }, [_hasHydrated]);

  // ── create ─────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!addForm.title.trim()) {
      toast({ title: "Title required", description: "Please enter a task title.", variant: "destructive" });
      return;
    }
    try {
      setActionLoading(true);
      const res = await axios.post("http://localhost:7001/task/createTask", addForm, {
        withCredentials: true,
      });
      addTask(res.data.data);
      toast({ title: "Task created", description: `"${addForm.title}" added.` });
      setShowAdd(false);
      setAddForm(emptyForm);
    } catch (err: any) {
      toast({
        title: "Failed to create task",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ── update status — optimistic with rollback ────────────────────────────────
  const handleStatusChange = async (task: Task, newStatus: Status) => {
    if (task.status === newStatus || actionLoading) return;

    updateTask(task._id, { status: newStatus }); // optimistic → localStorage

    try {
      await axios.patch(
        `http://localhost:7001/task/updateTaskStatus/${task._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
    } catch (err: any) {
      updateTask(task._id, { status: task.status }); // rollback
      toast({
        title: "Failed to update",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    }
  };

  // ── delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      setActionLoading(true);
      await axios.delete(`http://localhost:7001/task/deleteTask/${pendingDelete._id}`, {
        withCredentials: true,
      });
      deleteTask(pendingDelete._id);
      toast({
        title: "Task deleted",
        description: `"${pendingDelete.title}" removed.`,
        variant: "destructive",
      });
      setPendingDelete(null);
    } catch (err: any) {
      toast({
        title: "Failed to delete task",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // ── derived ────────────────────────────────────────────────────────────────
  const filtered = filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus);
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  // show skeleton while hydration is pending
  const isLoading = !_hasHydrated || fetchLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${tasks.length} total tasks`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-90"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "todo", "in_progress", "done"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
              filterStatus === s
                ? "bg-primary text-primary-foreground border-transparent"
                : "bg-background text-muted-foreground border-border hover:bg-secondary"
            }`}
          >
            {s === "all" ? "All" : statusConfig[s].label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                filterStatus === s
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-xl border border-border bg-secondary/30 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <CircleDashed size={32} className="mb-3 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">No tasks here</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            {filterStatus === "all"
              ? "Create your first task to get started."
              : `No tasks with status "${statusConfig[filterStatus as Status]?.label}".`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task) => {
            const cfg = statusConfig[task.status];
            return (
              <div
                key={task._id}
                className={`group relative flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${cfg.cardClass}`}
              >
                {/* Top row: badge + delete */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badgeClass}`}>
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <button
                    onClick={() => setPendingDelete(task)}
                    className="text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive rounded p-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Title */}
                <h3
                  className={`text-sm font-semibold leading-snug ${
                    task.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.title}
                </h3>

                {/* Description */}
                {task.description ? (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{task.description}</p>
                ) : (
                  <p className="text-xs text-muted-foreground/40 italic">No description</p>
                )}

                {/* Inline status selector */}
                <div className="mt-auto pt-3 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 flex-wrap">
                  {(["todo", "in_progress", "done"] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(task, s)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-all ${
                        task.status === s
                          ? "border-foreground/30 bg-foreground/10 text-foreground"
                          : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                      }`}
                    >
                      {s === "todo" ? "To Do" : s === "in_progress" ? "In Progress" : "Done"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={showAdd} onOpenChange={(open) => { if (!open) { setShowAdd(false); setAddForm(emptyForm); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>Add a new task to your list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="add-title">Title</Label>
              <Input
                id="add-title"
                placeholder="What needs to be done?"
                value={addForm.title}
                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-desc">Description</Label>
              <Textarea
                id="add-desc"
                placeholder="Optional details..."
                value={addForm.description}
                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={addForm.status} onValueChange={(v) => setAddForm({ ...addForm, status: v as Status })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setAddForm(emptyForm); }}>Cancel</Button>
            <Button onClick={handleAdd} disabled={actionLoading}>
              {actionLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">"{pendingDelete?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" size="default">Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TodoPage;