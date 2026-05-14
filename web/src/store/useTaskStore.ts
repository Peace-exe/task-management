import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
}

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  clearTasks: () => void;
}

const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set) => ({
        tasks: [],
        selectedTask: null,
        _hasHydrated: false,

        setHasHydrated: (val) =>
          set({ _hasHydrated: val }, false, "setHasHydrated"),

        setTasks: (tasks) =>
          set({ tasks }, false, "setTasks"),

        addTask: (task) =>
          set((state) => ({ tasks: [...state.tasks, task] }), false, "addTask"),

        updateTask: (id, data) =>
          set(
            (state) => ({
              tasks: state.tasks.map((t) =>
                t._id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
              ),
            }),
            false,
            "updateTask"
          ),

        deleteTask: (id) =>
          set(
            (state) => ({ tasks: state.tasks.filter((t) => t._id !== id) }),
            false,
            "deleteTask"
          ),

        setSelectedTask: (task) =>
          set({ selectedTask: task }, false, "setSelectedTask"),

        clearTasks: () =>
          set({ tasks: [], selectedTask: null }, false, "clearTasks"),
      }),
      {
        name: "task-store",
        storage: {
          getItem: (key) => {
            const val = localStorage.getItem(key);
            return val ? JSON.parse(val) : null;
          },
          setItem: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
          removeItem: (key) => localStorage.removeItem(key),
        },
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    ),
    { name: "TaskStore" }
  )
);

export default useTaskStore;