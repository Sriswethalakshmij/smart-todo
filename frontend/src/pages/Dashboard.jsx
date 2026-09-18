import { useEffect, useState } from "react";
import { CheckSquare, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import AddTaskModal from "../components/AddTaskModal";
import api from "../services/api";
import { taskCreatedMessages } from "../data/celebrationMessages";
import TaskCard from "../components/TaskCard";
import EditTaskModal from "../components/EditTaskModal";
import CalendarView from "../components/CalendarView";
import UserProfileModal from "../components/UserProfileModal";
function Dashboard() {
  const navigate = useNavigate();
  const [showAddTask, setShowAddTask] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedTaskDate, setSelectedTaskDate] = useState("");
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState("");
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  // Check logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("smart_todo_user");

    if (!storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("smart_todo_user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Load tasks
  const loadTasks = async () => {
    try {
      setTasksLoading(true);
      setTasksError("");

      const response = await api.get(
        "/controllers/get.php"
      );

      if (response.data.success) {
        setTasks(response.data.todos || []);
      } else {
        setTasksError(
          response.data.message ||
          "Unable to load tasks."
        );
      }
    } catch (error) {
      console.error("LOAD TASKS ERROR:", error);

      setTasksError(
        error.response?.data?.message ||
        "Unable to load your tasks."
      );
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // After creating a task
  const handleTaskCreated = async () => {
    await loadTasks();

    const randomIndex = Math.floor(
      Math.random() * taskCreatedMessages.length
    );

    setCelebrationMessage(
      taskCreatedMessages[randomIndex]
    );

    setTimeout(() => {
      setCelebrationMessage("");
    }, 4000);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("smart_todo_token");
    localStorage.removeItem("smart_todo_user");

    navigate("/login", { replace: true });
  };

  // Statistics
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "started"
  ).length;
  const filteredTasks = tasks.filter((task) => {
  const query = searchQuery.toLowerCase().trim();

  const matchesSearch =
    !query ||
    task.title?.toLowerCase().includes(query) ||
    task.description?.toLowerCase().includes(query);

  const matchesFilter =
    taskFilter === "all" ||
    task.status === taskFilter ||
    task.priority === taskFilter;

  return matchesSearch && matchesFilter;
});
const now = new Date();

const today =
  now.getFullYear() +
  "-" +
  String(now.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(now.getDate()).padStart(2, "0");
const overdueTasks = filteredTasks.filter(
  (task) =>
    task.due_date &&
    task.due_date < today &&
    task.status !== "completed"
);

const todayTasks = filteredTasks.filter(
  (task) =>
    task.due_date === today &&
    task.status !== "completed"
);

const upcomingTasks = filteredTasks.filter(
  (task) =>
    task.due_date &&
    task.due_date > today &&
    task.status !== "completed"
);

const completedFilteredTasks = filteredTasks.filter(
  (task) => task.status === "completed"
);
const todayTotalTasks = tasks.filter(
  (task) => task.due_date === today
).length;

const todayCompletedTasks = tasks.filter(
  (task) =>
    task.due_date === today &&
    task.status === "completed"
).length;

const todayProgress =
  todayTotalTasks === 0
    ? 0
    : Math.round(
        (todayCompletedTasks / todayTotalTasks) * 100
      );

const getProgressMessage = () => {
  if (todayTotalTasks === 0) {
    return "No tasks scheduled for today.";
  }

  if (todayProgress === 0) {
    return "Let's get started.";
  }

  if (todayProgress < 50) {
    return "You're making progress. Keep going!";
  }

  if (todayProgress < 100) {
    return "You're more than halfway there! 🔥";
  }

  return "Amazing! You completed everything! 🎉";
};

const noDueDateTasks = filteredTasks.filter(
  (task) => !task.due_date && task.status !== "completed"
);
const renderTask = (task) => (
  <TaskCard
    key={task.id}
    task={task}
    onTaskUpdated={async () => {
  await loadTasks();
}}
    onTaskDeleted={(deletedId) => {
      setTasks((currentTasks) =>
        currentTasks.filter(
          (item) => item.id !== deletedId
        )
      );
    }}
    onEdit={(task) => setEditingTask(task)}
    onCompleted={() => {
      const messages = [
        "🎉 Boom! Another task completed!",
        "🔥 You're on a roll!",
        "✨ That's one more thing off your list!",
        "🏆 Nice work! Keep the momentum going!",
        "🚀 Task completed. You're moving forward!",
        "💪 Done and dusted!",
        "🎯 Bullseye! You nailed it!",
        "🌟 Small win, big progress!",
        "👏 Great job! Keep going!",
        "🥳 Another win for today!",
      ];

      const randomMessage =
        messages[
          Math.floor(
            Math.random() * messages.length
          )
        ];

      setCelebrationMessage(randomMessage);

      setTimeout(() => {
        setCelebrationMessage("");
      }, 4000);
    }}
  />
);
return (
  <div className="dashboard-page">

<header className="dashboard-header">

  <div className="dashboard-brand">

    <div className="dashboard-logo">
      <CheckSquare size={22} />
    </div>

    <div>
      <strong>SMART TODO</strong>
      <span>YOUR DAILY SPACE</span>
    </div>

  </div>

  <div className="dashboard-header-actions">

    <button
      type="button"
      className="dashboard-profile-button"
      onClick={() => {
        console.log("PROFILE CLICKED");
        setShowProfile(true);
      }}
    >
      <span className="dashboard-profile-avatar">
        <User size={17} />
      </span>

      <span className="dashboard-profile-name">
        {user?.username || "Profile"}
      </span>
    </button>

    <ThemeToggle />

    <button
      type="button"
      className="dashboard-logout"
      onClick={handleLogout}
    >
      <LogOut size={17} />
      <span>Logout</span>
    </button>

  </div>

</header>

    {celebrationMessage && (
      <div className="celebration-toast">
        <span>{celebrationMessage}</span>
      </div>
    )}

      {celebrationMessage && (
        <div className="celebration-toast">
          <span>{celebrationMessage}</span>
        </div>
      )}

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <p className="dashboard-label">
            YOUR DASHBOARD
          </p>

          <h1>
            Let's get things
            <br />
            <span>done.</span>
          </h1>

          <p className="dashboard-description">
            Welcome back
            {user?.username ? `, ${user.username}` : ""}.
            <br />
            Your tasks, your plans, your progress — all in one place.
          </p>
        </section>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <span>TOTAL TASKS</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="dashboard-stat-card">
            <span>IN PROGRESS</span>
            <strong>{inProgressTasks}</strong>
          </div>

          <div className="dashboard-stat-card">
            <span>COMPLETED</span>
            <strong>{completedTasks}</strong>
          </div>
        </section>
        <section className="productivity-progress">

  <div className="progress-heading">
    <div>
      <p>TODAY'S PROGRESS</p>
      <h2>
        {getProgressMessage()}
      </h2>
    </div>

    <strong>{todayProgress}%</strong>
  </div>

  <div className="progress-bar">
    <div
      className="progress-bar-fill"
      style={{
        width: `${todayProgress}%`,
      }}
    />
  </div>

  <div className="progress-footer">
    <span>
      {todayCompletedTasks} of {todayTotalTasks} tasks completed
    </span>

    {todayTotalTasks > 0 && (
      <span>
        {todayTotalTasks - todayCompletedTasks} remaining
      </span>
    )}
  </div>

</section>

<CalendarView
  tasks={tasks}
  onAddTask={(selectedDate) => {
    setSelectedTaskDate(selectedDate);
    setShowAddTask(true);
  }}
/>

<section className="dashboard-tasks">

  <div className="dashboard-section-heading">
    <div>
      <p>YOUR WORK</p>
      <h2>My Tasks</h2>
    </div>

    <button
      type="button"
      className="add-task-button"
      onClick={() => setShowAddTask(true)}
    >
      + Add Task
    </button>
  </div>

  {/* SEARCH + FILTERS */}
  <div className="task-tools">

    <div className="task-search">
      <span>⌕</span>

      <input
        type="text"
        placeholder="Search your tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    <div className="task-filters">

      <button
        type="button"
        className={taskFilter === "all" ? "active" : ""}
        onClick={() => setTaskFilter("all")}
      >
        All
      </button>

      <button
        type="button"
        className={taskFilter === "assigned" ? "active" : ""}
        onClick={() => setTaskFilter("assigned")}
      >
        Assigned
      </button>

      <button
        type="button"
        className={taskFilter === "started" ? "active" : ""}
        onClick={() => setTaskFilter("started")}
      >
        In Progress
      </button>

      <button
        type="button"
        className={taskFilter === "completed" ? "active" : ""}
        onClick={() => setTaskFilter("completed")}
      >
        Completed
      </button>

      <button
        type="button"
        className={taskFilter === "high" ? "active" : ""}
        onClick={() => setTaskFilter("high")}
      >
        High
      </button>

      <button
        type="button"
        className={taskFilter === "medium" ? "active" : ""}
        onClick={() => setTaskFilter("medium")}
      >
        Medium
      </button>

      <button
        type="button"
        className={taskFilter === "low" ? "active" : ""}
        onClick={() => setTaskFilter("low")}
      >
        Low
      </button>

    </div>
  </div>

  {/* TASK CONTENT */}
  {tasksLoading ? (

    <div className="empty-tasks">
      <h3>Loading your tasks...</h3>
      <p>Please wait a moment.</p>
    </div>

  ) : tasksError ? (

    <div className="empty-tasks">
      <h3>Unable to load tasks</h3>
      <p>{tasksError}</p>
    </div>

  ) : tasks.length === 0 ? (

    <div className="empty-tasks">

      <div className="empty-task-icon">
        <CheckSquare size={26} />
      </div>

      <h3>No tasks yet</h3>

      <p>
        Start by adding something you want
        to accomplish.
      </p>

      <button
        type="button"
        className="empty-add-button"
        onClick={() => setShowAddTask(true)}
      >
        Create your first task
      </button>

    </div>

  ) : filteredTasks.length === 0 ? (

    <div className="empty-tasks">

      <div className="empty-task-icon">
        🔎
      </div>

      <h3>No matching tasks</h3>

      <p>
        Try a different search or filter.
      </p>

      <button
        type="button"
        className="empty-add-button"
        onClick={() => {
          setSearchQuery("");
          setTaskFilter("all");
        }}
      >
        Clear filters
      </button>

    </div>

  ) : (

    <div className="task-groups">

  {overdueTasks.length > 0 && (
    <div className="task-group">

      <div className="task-group-heading overdue">
        <div>
          <span>⚠</span>
          <h3>Overdue</h3>
        </div>

        <strong>{overdueTasks.length}</strong>
      </div>

      <div className="task-list">
        {overdueTasks.map(renderTask)}
      </div>

    </div>
  )}

  {todayTasks.length > 0 && (
    <div className="task-group">

      <div className="task-group-heading today">
        <div>
          <span>●</span>
          <h3>Today</h3>
        </div>

        <strong>{todayTasks.length}</strong>
      </div>

      <div className="task-list">
        {todayTasks.map(renderTask)}
      </div>

    </div>
  )}

  {upcomingTasks.length > 0 && (
    <div className="task-group">

      <div className="task-group-heading upcoming">
        <div>
          <span>→</span>
          <h3>Upcoming</h3>
        </div>

        <strong>{upcomingTasks.length}</strong>
      </div>

      <div className="task-list">
        {upcomingTasks.map(renderTask)}
      </div>

    </div>
  )}

  {noDueDateTasks.length > 0 && (
    <div className="task-group">

      <div className="task-group-heading no-date">
        <div>
          <span>○</span>
          <h3>No Due Date</h3>
        </div>

        <strong>{noDueDateTasks.length}</strong>
      </div>

      <div className="task-list">
        {noDueDateTasks.map(renderTask)}
      </div>

    </div>
  )}

  {completedFilteredTasks.length > 0 && (
    <div className="task-group">

      <div className="task-group-heading completed">
        <div>
          <span>✓</span>
          <h3>Completed</h3>
        </div>

        <strong>{completedFilteredTasks.length}</strong>
      </div>

      <div className="task-list">
        {completedFilteredTasks.map(renderTask)}
      </div>

    </div>
  )}

</div>

  )}

</section>
      </main>

      {showAddTask && (
        <AddTaskModal
  initialDueDate={selectedTaskDate}
  onClose={() => {
    setShowAddTask(false);
    setSelectedTaskDate("");
  }}
  onTaskCreated={() => {
    setSelectedTaskDate("");
    handleTaskCreated();
  }}
/>
      )}
      {editingTask && (
  <EditTaskModal
    task={editingTask}
    onClose={() => setEditingTask(null)}
    onTaskUpdated={loadTasks}
  />
)}
{showProfile && (
  <UserProfileModal
    user={user}
    onClose={() => setShowProfile(false)}
  />
)}
    </div>
  );
}

export default Dashboard;