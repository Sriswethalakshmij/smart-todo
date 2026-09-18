import { useState } from "react";
import {
  Check,
  Pencil,
  Trash2,
  Play,
  Circle,
} from "lucide-react";
import api from "../services/api";
const formatTaskDate = (dateString, timeString) => {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dateText;

  if (date.getTime() === today.getTime()) {
    dateText = "Today";
  } else if (date.getTime() === tomorrow.getTime()) {
    dateText = "Tomorrow";
  } else {
    dateText = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (!timeString) {
    return dateText;
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  const time = new Date();
  time.setHours(hours, minutes, 0, 0);

  const timeText = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${dateText} · ${timeText}`;
};

function TaskCard({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onCompleted,
  onEdit,
}) {  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus) => {
    try {
      setLoading(true);

      const response = await api.put(
  `/controllers/update.php?id=${task.id}`,
  {
    title: task.title,
    description: task.description || "",
    status: newStatus,
    priority: task.priority,
    due_date: task.due_date || null,
    due_time: task.due_time || null,
  }
);

      if (response.data.success) {
        onTaskUpdated?.();

        if (
          newStatus === "completed" &&
          task.status !== "completed"
        ) {
          onCompleted?.();
        }
      } else {
        alert(
          response.data.message ||
          "Unable to update task."
        );
      }
    } catch (error) {
      console.error("UPDATE TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update task."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

     const response = await api.delete(
  `/controllers/delete.php?id=${task.id}`
);

      if (response.data.success) {
        onTaskDeleted?.(task.id);
      } else {
        alert(
          response.data.message ||
          "Unable to delete task."
        );
      }
    } catch (error) {
      console.error("DELETE TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Unable to delete task."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`task-card ${
        task.status === "completed"
          ? "task-completed"
          : ""
      }`}
    >
      <div className="task-card-main">

        <button
          type="button"
          className={`task-checkbox ${
            task.status === "completed"
              ? "checked"
              : ""
          }`}
          disabled={loading}
          onClick={() =>
            updateStatus(
              task.status === "completed"
                ? "assigned"
                : "completed"
            )
          }
          aria-label="Complete task"
        >
          {task.status === "completed" && (
            <Check size={15} />
          )}
        </button>

        <div className="task-card-content">
          <h3>{task.title}</h3>

          {task.description && (
            <p>{task.description}</p>
          )}

          <div className="task-status-row">
            {task.status === "assigned" && (
              <button
                type="button"
                className="status-action assigned"
                disabled={loading}
                onClick={() =>
                  updateStatus("started")
                }
              >
                <Circle size={11} />
                Assigned
              </button>
            )}

            {task.status === "started" && (
              <button
                type="button"
                className="status-action started"
                disabled={loading}
                onClick={() =>
                  updateStatus("completed")
                }
              >
                <Play size={11} />
                In Progress
              </button>
            )}

            {task.status === "completed" && (
              <span className="status-action completed">
                <Check size={11} />
                Completed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-card-meta">

        <span
          className={`task-priority ${task.priority}`}
        >
          {task.priority}
        </span>

        {task.due_date && (
  <span className="task-due-date">
    {formatTaskDate(task.due_date, task.due_time)}
  </span>
)}

        <div className="task-actions">
          <button
  type="button"
  className="task-action-button"
  title="Edit task"
  disabled={loading}
  onClick={() => onEdit?.(task)}
>
  <Pencil size={15} />
</button>

          <button
            type="button"
            className="task-action-button delete"
            title="Delete task"
            disabled={loading}
            onClick={deleteTask}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;