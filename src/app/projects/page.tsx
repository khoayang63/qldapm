export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Projects
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Projects
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Create, rename, and archive projects. Progress is calculated from
          completed tasks in the core MVP.
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Project cards will render here once the core MVP is built. The seed
          script already ships realistic demo projects, including one archived
          project.
        </p>
      </div>
    </div>
  );
}
