import { useMemo, useState } from "react";

function formatDateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function CalendarView({
  tasks = [],
  onDateSelect,
  onAddTask,
}) {  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState(
    formatDateKey(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    )
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [firstDay, daysInMonth]);

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.due_date) return;

      if (!grouped[task.due_date]) {
        grouped[task.due_date] = [];
      }

      grouped[task.due_date].push(task);
    });

    return grouped;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDate] || [];

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(year, month - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    const todayDate = new Date();

    setCurrentMonth(
      new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        1
      )
    );

    const todayKey = formatDateKey(
      todayDate.getFullYear(),
      todayDate.getMonth(),
      todayDate.getDate()
    );

    setSelectedDate(todayKey);
    onDateSelect?.(todayKey);
  };

  const handleDateClick = (day) => {
    if (!day) return;

    const dateKey = formatDateKey(year, month, day);

    setSelectedDate(dateKey);
    onDateSelect?.(dateKey);
  };

  return (
    <section className="calendar-view">

      <div className="calendar-header">

        <div>
          <p className="calendar-label">
            YOUR SCHEDULE
          </p>

          <h2>
            {currentMonth.toLocaleDateString(
              "en-US",
              {
                month: "long",
                year: "numeric",
              }
            )}
          </h2>
        </div>

        <div className="calendar-navigation">

          <button
            type="button"
            onClick={goToToday}
          >
            Today
          </button>

          <button
            type="button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
          >
            ←
          </button>

          <button
            type="button"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            →
          </button>

        </div>

      </div>

      <div className="calendar-weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">

        {calendarDays.map((day, index) => {

          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="calendar-day empty"
              />
            );
          }

          const dateKey = formatDateKey(
            year,
            month,
            day
          );

          const dayTasks =
            tasksByDate[dateKey] || [];

          const isSelected =
            selectedDate === dateKey;

          const isToday =
            dateKey ===
            formatDateKey(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );

          return (
            <button
              type="button"
              key={dateKey}
              className={`calendar-day ${
                isSelected ? "selected" : ""
              } ${isToday ? "today" : ""}`}
              onClick={() =>
                handleDateClick(day)
              }
            >

              <span className="calendar-day-number">
                {day}
              </span>

              {dayTasks.length > 0 && (
                <span className="calendar-task-count">
                  {dayTasks.length}
                </span>
              )}

            </button>
          );
        })}

      </div>

      <div className="calendar-selected">

        <div className="calendar-selected-heading">
  <div>
    <p>SELECTED DATE</p>

    <h3>
      {new Date(
        `${selectedDate}T00:00:00`
      ).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )}
    </h3>
  </div>

  <div className="calendar-selected-actions">
    <strong>
      {selectedTasks.length}
    </strong>

    <button
      type="button"
      onClick={() => onAddTask?.(selectedDate)}
    >
      + Add Task
    </button>
  </div>
</div>

        {selectedTasks.length === 0 ? (

          <div className="calendar-empty">
            <p>No tasks scheduled for this date.</p>
          </div>

        ) : (

          <div className="calendar-task-list">

            {selectedTasks.map((task) => (

              <div
                key={task.id}
                className={`calendar-task ${
                  task.status === "completed"
                    ? "completed"
                    : ""
                }`}
              >

                <div className="calendar-task-info">

                  <strong>
                    {task.title}
                  </strong>

                  {task.description && (
                    <span>
                      {task.description}
                    </span>
                  )}

                </div>

                <div className="calendar-task-meta">

                  <span
                    className={`task-priority ${task.priority}`}
                  >
                    {task.priority}
                  </span>

                  {task.due_time && (
                    <span>
                      {task.due_time}
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default CalendarView;