"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";

interface TaskItemProps {
  task: Task;
  onTaskChange: () => void;
}

export default function TaskItem({ task, onTaskChange }: TaskItemProps) {
  const [isChecked, setIsChecked] = useState(task.is_complete);

  const handleCheckboxChange = () => {
    // Placeholder - will be implemented in Phase 6
    setIsChecked(!isChecked);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        {/* Checkbox - will be functional in Phase 6 */}
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
        />

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-medium ${
              isChecked
                ? "line-through text-gray-500"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              className={`mt-1 text-sm ${
                isChecked ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {task.description}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-400">
            Created: {formatDate(task.created_at)}
          </p>
        </div>

        {/* Action Buttons - will be functional in Phase 7 */}
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
            onClick={() => {
              // Placeholder - Edit functionality in Phase 7
              alert("Edit feature coming in Phase 7!");
            }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
            onClick={() => {
              // Placeholder - Delete functionality in Phase 7
              alert("Delete feature coming in Phase 7!");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
