import { useId } from "react";

const Input = ({ label, type = "text", icon, error, className = "", ...props }) => {
  const id = useId();
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full rounded-xl border bg-white/80 px-4 py-3 text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${
            icon ? "pl-10" : ""
          } ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : "border-slate-200"}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
