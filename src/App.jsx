
import { useEffect, useState } from "react";
import "./App.css";

const emptyForm = {
  title: "",
  subject: "",
  deadline: "",
  priority: "Medium",
};

function StudyForm({ onAddTask }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Please enter a task title.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must contain at least 3 characters.";
    }

    if (!form.subject) {
      newErrors.subject = "Please select a subject.";
    }

    if (!form.deadline) {
      newErrors.deadline = "Please select a deadline.";
    } else if (form.deadline < new Date().toLocaleDateString("en-CA")) {
      newErrors.deadline = "Deadline cannot be in the past.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessage("");
      return;
    }

    onAddTask({
      ...form,
      title: form.title.trim(),
      id: Date.now(),
      completed: false,
    });

    setForm(emptyForm);
    setErrors({});
    setMessage("Study task added successfully!");
  }

  return (
    <section className="panel">
      <h2>Add a Study Task</h2>
      <p className="muted">Plan your next study session.</p>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">Task Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Revise Operating Systems"
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title && <p className="error">{errors.title}</p>}

        <label htmlFor="subject">Subject</label>
        <select
          id="subject"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          aria-invalid={Boolean(errors.subject)}
        >
          <option value="">Select a subject</option>
          <option value="AIML">Artificial Intelligence</option>
          <option value="OS">Operating Systems</option>
          <option value="DSA">Data Structures</option>
          <option value="DBMS">Database Management</option>
          <option value="Other">Other</option>
        </select>
        {errors.subject && <p className="error">{errors.subject}</p>}

        <label htmlFor="deadline">Deadline</label>
        <input
          id="deadline"
          type="date"
          name="deadline"
          min={new Date().toLocaleDateString("en-CA")}
          value={form.deadline}
          onChange={handleChange}
          aria-invalid={Boolean(errors.deadline)}
        />
        {errors.deadline && <p className="error">{errors.deadline}</p>}

        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit" className="primary-button">
          + Add Task
        </button>

        {message && (
          <p className="success" role="status">{message}</p>
        )}
      </form>
    </section>
  );
}

function TaskList({ tasks, onToggle, onDelete, filter, setFilter }) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Pending") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  return (
    <section className="panel">
      <div className="list-heading">
        <div>
          <h2>Your Study Tasks</h2>
          <p className="muted">
            {tasks.filter((task) => task.completed).length} of {tasks.length} completed
          </p>
        </div>
        <select
          aria-label="Filter tasks"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <span>📚</span>
          <p>No tasks here yet.</p>
          <p className="muted">Add a task to start planning your study day.</p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <article className="task-card" key={task.id}>
              <div className="task-details">
                <h3 className={task.completed ? "completed" : ""}>
                  {task.title}
                </h3>
                <p>{task.subject} · Due {task.deadline}</p>
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority} Priority
                </span>
                {task.completed && <span className="completed-label">Completed</span>}
              </div>

              <div className="task-actions">
                <button
                  className="secondary-button"
                  onClick={() => onToggle(task.id)}
                >
                  {task.completed ? "Undo" : "Complete"}
                </button>
                <button
                  className="delete-button"
                  onClick={() => onDelete(task.id)}
                  aria-label={`Delete ${task.title}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("studysync-tasks")) || [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("studysync-tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(task) {
    setTasks((previous) => [task, ...previous]);
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="StudySync home">
          <span className="brand-icon">S</span>
          StudySync
        </a>
        <span className="topbar-note">Your space to focus and grow ✦</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL STUDY PLANNER</p>
        <h1>Make time for what <span>matters.</span></h1>
        <p>One task at a time. Build better study habits, stay organized, and make progress every day.</p>
      </section>

      <section className="stats">
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>
        <div className="stat-card">
          <span>Pending</span>
          <strong>{tasks.filter((task) => !task.completed).length}</strong>
        </div>
        <div className="stat-card">
          <span>Completed</span>
          <strong>{tasks.filter((task) => task.completed).length}</strong>
        </div>
      </section>

      <div className="workspace">
        <StudyForm onAddTask={addTask} />
        <TaskList
          tasks={tasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      <footer>StudySync · Small steps make big progress.</footer>
    </main>
  );
}
