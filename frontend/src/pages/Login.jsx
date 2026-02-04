import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/client";
import Input from "../components/Input";
import Button from "../components/Button";

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

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await client.post("/auth/login", form);
      localStorage.setItem("token", res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50">
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
        <div className="glass w-full rounded-2xl p-8 shadow-xl animate-[fadeIn_0.4s_ease-out]">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              TF
            </div>
            <h1 className="text-2xl font-semibold text-slate-800">TaskFlow</h1>
            <p className="mt-1 text-sm text-slate-500">Welcome back. Please sign in.</p>
          </div>

          {msg && (
            <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                Remember me
              </label>
              <span className="text-slate-400">Forgot password?</span>
            </div>

            <Button type="submit" className="w-full">Sign in</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New here? <Link to="/register" className="text-indigo-600 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Login;
