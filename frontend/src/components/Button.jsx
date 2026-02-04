const Button = ({ variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2";
  const styles = {
    primary: "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:from-indigo-600 hover:to-blue-600 focus:ring-indigo-200",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-200"
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props} />
  );
};

export default Button;
