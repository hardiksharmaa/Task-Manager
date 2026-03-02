"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Task {
  id: string;
  title: string;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await api.get("/tasks");
      setTasks(res.data.data);
    };

    fetchTasks();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight">
        Your Tasks
      </h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-200 rounded-lg px-4 py-3 flex justify-between"
          >
            <span>{task.title}</span>
            <span className="text-sm text-gray-400">
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}