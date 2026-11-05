import Link from "next/link";

const stats = [
  { label: "Due today", value: "—" },
  { label: "Overdue", value: "—" },
  { label: "Active projects", value: "—" },
];

const setupSteps = [
  "Copy .env.example to .env.",
  "Run npx prisma migrate dev.",
  "Run npm run seed for demo data.",
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Dashboard
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Welcome to qldapm
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          A single-user workspace for projects and tasks. The app shell, data
          model, and seed data are wired up; live dashboard data arrives with the
          core MVP.
        </p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold">Scaffold checklist</h3>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          On a clean checkout, run these steps from the repository root.
        </p>
        <ol className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {setupSteps.map((step) => (
            <li key={step} className="flex gap-3">
              <span className="text-zinc-400 dark:text-zinc-600">→</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Go to tasks
          </Link>
          <Link
            href="/projects"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Go to projects
          </Link>
        </div>
      </section>
    </div>
  );
}
