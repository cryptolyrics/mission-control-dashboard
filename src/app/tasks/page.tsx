"use client";

import { useState } from "react";
import NewTaskModal from "@/components/NewTaskModal";

type Task = {
  id: string;
  title: string;
  assignee: string | null;
};

const columns = [
  { id: "planning", title: "Planning", color: "bg-text-secondary" },
  { id: "inbox", title: "Inbox", color: "bg-warning" },
  { id: "assigned", title: "Assigned", color: "bg-primary" },
  { id: "inprogress", title: "In Progress", color: "bg-highlight" },
  { id: "testing", title: "Testing", color: "bg-warning" },
  { id: "review", title: "Review", color: "bg-primary" },
  { id: "done", title: "Done", color: "bg-success" },
];

const initialTasks: Record<string, Task[]> = {
  planning: [
    { id: "1", title: "Q1 Marketing Strategy", assignee: null },
    { id: "2", title: "Website Redesign Brief", assignee: null },
  ],
  inbox: [
    { id: "3", title: "Fix login bug", assignee: null },
    { id: "4", title: "Update documentation", assignee: null },
    { id: "5", title: "Client feedback review", assignee: null },
  ],
  assigned: [
    { id: "6", title: "API integration", assignee: "Vlad" },
    { id: "7", title: "Database migration", assignee: "Vlad" },
    { id: "8", title: "User research", assignee: "Ali" },
  ],
  inprogress: [
    { id: "9", title: "Payment gateway", assignee: "Vlad" },
    { id: "10", title: "Dashboard hosting", assignee: "Vlad" },
    { id: "11", title: "Email templates", assignee: "Ali" },
    { id: "12", title: "Mobile responsive", assignee: "Ali" },
  ],
  testing: [
    { id: "13", title: "Security audit", assignee: "Coppa" },
    { id: "14", title: "Performance test", assignee: "Vlad" },
  ],
  review: [
    { id: "15", title: "New landing page", assignee: "Ali" },
  ],
  done: [
    { id: "16", title: "Setup CI/CD pipeline", assignee: "Vlad" },
    { id: "17", title: "User onboarding flow", assignee: "Ali" },
    { id: "18", title: "Analytics integration", assignee: "Vlad" },
    { id: "19", title: "Backup system", assignee: "Vlad" },
    { id: "20", title: "API documentation", assignee: "Ali" },
  ],
};

export default function TasksPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [draggedTask, setDraggedTask] = useState<{ task: Task; column: string } | null>(null);

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, column: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumn: string) => {
    if (!draggedTask) return;
    
    const sourceColumn = draggedTask.column;
    if (sourceColumn === targetColumn) {
      setDraggedTask(null);
      return;
    }

    setTasks((prev) => {
      const newTasks = { ...prev };
      newTasks[sourceColumn] = newTasks[sourceColumn].filter((t) => t.id !== draggedTask.task.id);
      newTasks[targetColumn] = [...newTasks[targetColumn], draggedTask.task];
      return newTasks;
    });
    setDraggedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary">Manage and track all tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-card border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary">
            <option>Filter by Status</option>
            <option>Filter by Agent</option>
            <option>Filter by Due Date</option>
          </select>
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-primary text-background font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-48"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
              <h3 className="font-medium text-sm">{column.title}</h3>
              <span className="text-xs text-text-secondary bg-card-hover px-2 py-0.5 rounded-full">
                {tasks[column.id].length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks[column.id].map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task, column.id)}
                  className="bg-card rounded-lg p-3 border border-white/5 cursor-grab active:cursor-grabbing hover:border-white/10 transition-colors"
                >
                  <p className="text-sm font-medium mb-2">{task.title}</p>
                  {task.assignee && (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-secondary">Assigned to:</span>
                      <span className="text-xs text-primary">{task.assignee}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNewTaskModal && <NewTaskModal onClose={() => setShowNewTaskModal(false)} />}
    </div>
  );
}
