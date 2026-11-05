const filters = ["Status", "Priority", "Project", "Due date"];

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Tasks
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          All tasks
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          A filterable list of every task across projects. Create, edit, and
          delete flows land in the core MVP.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-dashed border-zinc-300 px-3 py-1 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
          >
            {filter}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Task rows will render here once the core MVP is built. The database
          schema already supports title, notes, status, priority, and due date.
        </p>
      </div>
    </div>
  );
}
