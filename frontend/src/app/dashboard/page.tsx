"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "ARCHIVED";
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const limit = 5;
  const [total, setTotal] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await api.get("/tasks", {
        params: {
          ...(search && { search }),
          ...(status && { status }),
          page,
          limit,
        },
      });

      setTasks(res.data.data);
      setTotal(res.data.meta.total);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [search, status, page]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await api.post("/tasks", {
        title: newTitle,
        description: newDescription,
      });

      toast.success("Task added");

      setNewTitle("");
      setNewDescription("");
      fetchTasks();
    } catch {
      toast.error("Failed to create task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await api.post(`/tasks/${id}/toggle`);
      toast.success("Task toggled");
      fetchTasks();
    } catch {
      toast.error("Failed to toggle task");
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleEdit = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      toast.success("Task updated");
      cancelEditing();
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const totalPages = Math.ceil(total / limit);

  const inputClass =
    "w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-8"
    >
      <h2 className="text-xl font-light tracking-tight text-white font-display">
        Your Tasks
      </h2>

      {/* Add Task */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        onSubmit={handleCreate}
        className="space-y-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5"
      >
        <input
          type="text"
          placeholder="Task title..."
          className={inputClass}
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Task description (optional)..."
          className={inputClass}
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:scale-[1.02] hover:shadow-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </motion.form>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex gap-4"
      >
        <input
          type="text"
          placeholder="Search tasks..."
          className={`flex-1 ${inputClass}`}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="bg-white/10 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-colors"
        >
          <option value="" className="bg-neutral-900">All</option>
          <option value="TODO" className="bg-neutral-900">Todo</option>
          <option value="DONE" className="bg-neutral-900">Done</option>
        </select>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="text-sm text-white/30 animate-pulse">
          Loading tasks...
        </div>
      )}

      {/* Empty State */}
      {!loading && tasks.length === 0 && (
        <div className="text-sm text-white/30">
          No tasks found.
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors duration-200"
            >
              {editingId === task.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    className={inputClass}
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Description (optional)"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="bg-white text-black px-3 py-1 rounded-lg text-sm font-medium hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="border border-white/20 text-white/70 px-3 py-1 rounded-lg text-sm hover:border-white/40 transition-colors duration-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        task.status === "DONE"
                          ? "line-through text-white/30"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <div className="text-xs text-white/40 mt-1">
                        {task.description}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 text-sm">
                    <button
                      onClick={() => startEditing(task)}
                      className="text-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggle(task.id)}
                      className="text-white/40 hover:text-white transition-colors duration-200"
                    >
                      {task.status === "DONE" ? "Undo" : "Done"}
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-white/30 hover:text-red-400 transition-colors duration-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="flex justify-center gap-2"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-md text-sm border transition-all duration-200 ${
                page === i + 1
                  ? "bg-white text-black border-white"
                  : "border-white/20 text-white/50 hover:border-white/50 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}