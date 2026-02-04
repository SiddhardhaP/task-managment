const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const badge = task.status === "done"
    ? "bg-green-100 text-green-700"
    : "bg-amber-100 text-amber-700";

  return (
    <div className="glass rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className={`text-base font-semibold ${task.status === "done" ? "line-through text-slate-400" : "text-slate-800"}`}>
          {task.title}
        </h3>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge}`}>
          {task.status === "done" ? "Done" : "Pending"}
        </span>
      </div>
      {task.description && (
        <p className="mt-2 text-sm text-slate-500">{task.description}</p>
      )}
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onToggle(task)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          {task.status === "done" ? "Mark Pending" : "Mark Done"}
        </button>
        <button
          onClick={() => onEdit(task)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
