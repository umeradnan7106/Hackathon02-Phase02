"use client";

import { useState } from "react";
import { createTask, getCurrentUser, getErrorMessage } from "@/lib/api";

interface TaskFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleLength = formData.title.length;
  const descriptionLength = formData.description.length;
  const isTitleValid = titleLength >= 1 && titleLength <= 100;
  const isDescriptionValid = descriptionLength <= 500;
  const canSubmit = isTitleValid && isDescriptionValid && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!canSubmit) return;

    setLoading(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        setError("User not found. Please log in again.");
        return;
      }

      await createTask(user.id, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
      });

      // Trigger event to refresh task list
      window.dispatchEvent(new Event("taskUpdated"));

      // Reset form and close
      setFormData({ title: "", description: "" });
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
            titleLength > 100
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="e.g., Buy groceries"
          disabled={loading}
        />
        <div className="mt-1 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {titleLength === 0
              ? "Required field"
              : titleLength > 100
              ? "Title too long"
              : ""}
          </span>
          <span
            className={`text-xs ${
              titleLength > 100 ? "text-red-500 font-semibold" : "text-gray-400"
            }`}
          >
            {titleLength}/100
          </span>
        </div>
      </div>

      {/* Description Textarea */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
            descriptionLength > 500
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          placeholder="e.g., Milk, eggs, bread, and fruits"
          disabled={loading}
        />
        <div className="mt-1 flex justify-end">
          <span
            className={`text-xs ${
              descriptionLength > 500
                ? "text-red-500 font-semibold"
                : "text-gray-400"
            }`}
          >
            {descriptionLength}/500
          </span>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </div>
    </form>
  );
}
