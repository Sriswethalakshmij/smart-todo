import { useState } from "react";
import { X, CalendarDays, Clock3 } from "lucide-react";
import api from "../services/api";

function AddTaskModal({ onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [status, setStatus] = useState("assigned");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post(
        "/controllers/create.php",
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
        onTaskCreated?.(response.data);
        onClose();
      } else {
        alert(
          response.data.message || "Unable to create task."
        );
      }
    } catch (error) {
      console.error("CREATE TASK ERROR:", error);

      alert(
        error.response?.data?.message ||
        "Unable to create task."
      );
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
            <p className="task-modal-label">NEW TASK</p>
            <h2>Create something to finish.</h2>
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
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              required
            />
          </div>

          <div className="task-form-group">
            <label>Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  onClick={() => setPriority("low")}
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
                  onClick={() => setPriority("medium")}
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
                  onClick={() => setPriority("high")}
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
            >
              Cancel
            </button>

            <button
              type="submit"
              className="task-create-button"
            >
              Create Task
              <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;