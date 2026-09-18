import { useState } from "react";
import { X, CalendarDays, Clock3 } from "lucide-react";
import api from "../services/api";

function EditTaskModal({ task, onClose, onTaskUpdated }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [priority, setPriority] = useState(
    task.priority || "medium"
  );
  const [dueDate, setDueDate] = useState(
    task.due_date || ""
  );
  const [dueTime, setDueTime] = useState(
    task.due_time || ""
  );
  const [status, setStatus] = useState(
    task.status || "assigned"
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await api.put(
        `/controllers/update.php?id=${task.id}`,
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          due_date: dueDate || null,
          due_time: dueTime || null,
          status,
        }
      );

      if (response.data.success) {
        onTaskUpdated?.();
        onClose();
      } else {
        alert(
          response.data.message ||
          "Unable to update task."
        );
      }
    } catch (error) {
      console.error("EDIT TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Unable to update task."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="task-modal-overlay"
      onClick={onClose}
    >
      <div
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="task-modal-header">
          <div>
            <p className="task-modal-label">
              EDIT TASK
            </p>

            <h2>Make a change.</h2>
          </div>

          <button
            type="button"
            className="task-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="task-form-group">
            <label>Task title</label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="What needs to get done?"
              required
            />
          </div>

          <div className="task-form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Add some details..."
              rows="4"
            />
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label>Priority</label>

              <div className="priority-options">
                <button
                  type="button"
                  className={
                    priority === "low"
                      ? "active low"
                      : ""
                  }
                  onClick={() =>
                    setPriority("low")
                  }
                >
                  Low
                </button>

                <button
                  type="button"
                  className={
                    priority === "medium"
                      ? "active medium"
                      : ""
                  }
                  onClick={() =>
                    setPriority("medium")
                  }
                >
                  Medium
                </button>

                <button
                  type="button"
                  className={
                    priority === "high"
                      ? "active high"
                      : ""
                  }
                  onClick={() =>
                    setPriority("high")
                  }
                >
                  High
                </button>
              </div>
            </div>

            <div className="task-form-group">
              <label>Status</label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option value="assigned">
                  Assigned
                </option>

                <option value="started">
                  Started
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label>Due date</label>

              <div className="input-with-icon">
                <CalendarDays size={17} />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="task-form-group">
              <label>Due time</label>

              <div className="input-with-icon">
                <Clock3 size={17} />

                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) =>
                    setDueTime(e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="task-modal-actions">
            <button
              type="button"
              className="task-cancel-button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="task-create-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
              {!saving && <span>↗</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;