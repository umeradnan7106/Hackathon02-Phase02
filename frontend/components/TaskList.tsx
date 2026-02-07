"use client";

import { useEffect, useState } from "react";
import { getTasks, getCurrentUser } from "@/lib/api";
import type { Task } from "@/lib/types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  onTaskUpdate: () => void;
}

export default function TaskList({ onTaskUpdate }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const user = getCurrentUser();
      if (!user) {
        setError("User not found. Please log in again.");
        return;
      }

      const response = await getTasks(user.id);
      setTasks(response.tasks);
    } catch (err: any) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Refresh tasks when onTaskUpdate is called
  useEffect(() => {
    const refreshTasks = () => {
      fetchTasks();
    };

    // Listen for custom event to refresh tasks
    window.addEventListener("taskUpdated", refreshTasks);
    return () => window.removeEventListener("taskUpdated", refreshTasks);
  }, []);

  const handleTaskChange = () => {
    fetchTasks();
    onTaskUpdate();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  // Task statistics
  const completedCount = tasks.filter((task) => task.is_complete).length;
  const totalCount = tasks.length;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No tasks yet
        </h3>
        <p className="text-gray-500">
          Get started by adding your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task Statistics */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
        <p className="text-indigo-900 font-medium">
          You have {totalCount} {totalCount === 1 ? "task" : "tasks"},{" "}
          {completedCount} completed
        </p>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onTaskChange={handleTaskChange} />
        ))}
      </div>
    </div>
  );
}
