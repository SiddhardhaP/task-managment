import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import Input from "../components/Input";
import Button from "../components/Button";

const Profile = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const loadProfile = async () => {
    try {
      const res = await client.get("/users/me");
      setForm({ name: res.data.data.name, email: res.data.data.email, password: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error loading profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password.trim()) payload.password = form.password;
      const res = await client.put("/users/me", payload);
      setMsg({ type: "success", text: res.data.message });
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Error updating profile" });
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <nav className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-semibold">
              TF
            </div>
            <span className="text-lg font-semibold text-slate-800">TaskFlow</span>
          </div>
          <Link to="/dashboard" className="text-sm text-indigo-600 hover:underline">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-slate-800">Profile Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Update your personal details.</p>

          {msg.text && (
            <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${msg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              disabled={loading}
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              disabled={loading}
            />
            <Input
              label="New Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current"
              disabled={loading}
            />

            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
