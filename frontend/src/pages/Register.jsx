import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import Input from "../components/Input";
import Button from "../components/Button";

const UserIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 20c2.5-3.5 13.5-3.5 16 0" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const MailIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400">
    <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const LockIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-slate-400">
    <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await client.post("/auth/register", form);
      setMsg(res.data.message);
      navigate("/login");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  const passwordHint = form.password.length < 6
    ? "Use at least 6 characters."
    : "Looks good.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="glass w-full rounded-2xl p-8 shadow-xl animate-[fadeIn_0.4s_ease-out]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              TF
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Start organizing your tasks.</p>
          </div>

          {msg && (
            <div className="mt-4 rounded-xl bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Name"
              name="name"
              placeholder="Ava Thompson"
              value={form.name}
              onChange={handleChange}
              icon={UserIcon}
            />
            <Input
              label="Email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              icon={MailIcon}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="????????"
              value={form.password}
              onChange={handleChange}
              icon={LockIcon}
            />
            <p className={`text-xs ${form.password.length < 6 ? "text-amber-600" : "text-green-600"}`}>
              {passwordHint}
            </p>

            <Button type="submit" className="w-full">Create account</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Register;
