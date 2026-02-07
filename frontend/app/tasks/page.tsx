"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, isAuthenticated } from "@/lib/api";
import type { User } from "@/lib/types";
import TaskList from "@/components/TaskList";
import Modal from "@/components/Modal";
import TaskForm from "@/components/TaskForm";

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [router]);

  const handleLogout = () => {
    logout();
    // logout() function already redirects to /login
  };

  const handleTaskUpdate = () => {
    // Force refresh of task list by updating key
    setRefreshKey((prev) => prev + 1);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTaskCreated = () => {
    setIsModalOpen(false);
    handleTaskUpdate();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Todo App</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">
                Welcome, <span className="font-semibold">{user.name || user.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all shadow-md hover:shadow-lg"
          >
            + Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <TaskList key={refreshKey} onTaskUpdate={handleTaskUpdate} />
        </div>
      </main>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title="Create New Task"
      >
        <TaskForm onSuccess={handleTaskCreated} onCancel={handleModalClose} />
      </Modal>
    </div>
  );
}
