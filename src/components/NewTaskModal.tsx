"use client";

import { useState } from "react";

interface NewTaskModalProps {
  onClose: () => void;
}

export default function NewTaskModal({ onClose }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"form" | "ai-questions">("form");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      setStep("ai-questions");
    }
  };

  const handleAssign = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: description.trim()
            ? `${title.trim()} — ${description.trim()}`
            : title.trim(),
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!data.ok) {
        setError(data.error || "Failed to assign task");
      } else {
        onClose();
      }
    } catch (e) {
      setError("Failed to connect");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {step === "form" ? "Create New Task" : "AI Task Planning"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-card-hover flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {step === "form" ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Research competitor pricing"
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done..."
                rows={4}
                className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
            {error && (
              <div className="px-3 py-2 bg-error/20 text-error text-sm rounded">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-primary text-background font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Plan with AI →
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-background rounded-lg p-4 border border-white/5">
              <p className="text-sm text-text-secondary mb-2">🤖 AI Assistant</p>
              <p className="text-sm">
                I&apos;d like to clarify a few things before assigning this task:
              </p>
              <ol className="text-sm space-y-2 mt-3 list-decimal list-inside">
                <li>What is the expected deadline for this task?</li>
                <li>Should the agent prioritize speed or thoroughness?</li>
                <li>Do you have any specific sources or tools to use?</li>
              </ol>
            </div>
            {error && (
              <div className="px-3 py-2 bg-error/20 text-error text-sm rounded">
                {error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("form")}
                className="flex-1 px-4 py-3 border border-white/10 rounded-lg hover:bg-card-hover transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleAssign}
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-success text-background font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Assigning..." : "Assign Best Agent"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
