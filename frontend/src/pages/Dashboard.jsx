import { useEffect, useState } from "react";
import client from "../api/client";
import Button from "../components/Button";
import Input from "../components/Input";
import TaskCard from "../components/TaskCard";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [msg, setMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const loadTasks = async () => {
    try {
      const res = await client.get("/tasks");
      setTasks(res.data.data || []);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error loading tasks");
    }
  };

  const openModal = (task = null) => {
    setEditing(task);
    setForm({ title: task?.title || "", description: task?.description || "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm({ title: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      if (editing) {
        const res = await client.put(`/tasks/${editing.id}`, form);
        setMsg(res.data.message);
      } else {
        const res = await client.post("/tasks", form);
        setMsg(res.data.message);
      }
      closeModal();
      loadTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error saving task");
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await client.delete(`/tasks/${id}`);
      setMsg(res.data.message);
      loadTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error deleting task");
    }
  };

  const toggleStatus = async (task) => {
    const next = task.status === "done" ? "pending" : "done";
    try {
      const res = await client.put(`/tasks/${task.id}`, { status: next });
      setMsg(res.data.message);
      loadTasks();
    } catch (err) {
      setMsg(err.response?.data?.message || "Error updating status");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <nav className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-semibold">
              TF
            </div>
            <span className="text-lg font-semibold text-slate-800">TaskFlow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => (window.location.href = "/profile")}>
              Profile
            </Button>
            <Button variant="secondary" onClick={logout}>Logout</Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Your Tasks</h2>
            <p className="text-sm text-slate-500">Manage your daily work with clarity.</p>
          </div>
          <Button onClick={() => openModal()} className="hidden sm:inline-flex">
            + Add Task
          </Button>
        </div>

        {msg && (
          <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            {msg}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openModal}
              onDelete={deleteTask}
              onToggle={toggleStatus}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => openModal()}
        className="fixed bottom-6 right-6 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-5 py-4 text-white shadow-2xl transition-all hover:scale-105 sm:hidden"
      >
        +
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
          <div className="glass w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editing ? "Edit Task" : "New Task"}
              </h3>
              <button onClick={closeModal} className="text-slate-500">?</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <Input
                label="Title"
                placeholder="Design onboarding flow"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                label="Description"
                placeholder="Short description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
