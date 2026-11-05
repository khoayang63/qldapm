import Link from "next/link";
import { Alert, DueDateLabel, PriorityBadge, ProgressBar, StatusBadge } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  compareTasksByPriorityAndDueDate,
  projectProgress,
  startOfDay,
} from "@/lib/task";

export const dynamic = "force-dynamic";

type SearchParams = {
  error?: string;
  notice?: string;
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;

  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [projects, dueToday, overdue] = await Promise.all([
    prisma.project.findMany({
      where: { archivedAt: null },
      orderBy: { name: "asc" },
      include: { tasks: { select: { status: true } } },
    }),
    prisma.task.findMany({
      where: {
        status: { not: "Done" },
        dueDate: { gte: today, lt: tomorrow },
      },
      include: { project: true },
    }),
    prisma.task.findMany({
      where: {
        status: { not: "Done" },
        dueDate: { lt: today },
      },
      include: { project: true },
    }),
  ]);

  const todayTasks = [...dueToday].sort(compareTasksByPriorityAndDueDate);
  const overdueTasks = [...overdue].sort(compareTasksByPriorityAndDueDate);

  const stats = [
    { label: "Due today", value: todayTasks.length },
    { label: "Overdue", value: overdueTasks.length },
    { label: "Active projects", value: projects.length },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Dashboard
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">
          Today at a glance
        </h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Focus on what is due today, clear anything overdue, and watch each
          project move forward.
        </p>
      </header>

      <Alert error={error} notice={notice} />

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Due today</h3>
            <Link
              href="/tasks"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All tasks
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              Nothing due today. Enjoy the clear runway.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {todayTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="mt-1 font-medium">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <DueDateLabel dueDate={task.dueDate} />
                    <Link
                      href={`/projects/${task.projectId}`}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {task.project.name}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">Overdue</h3>
            <Link
              href="/tasks"
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All tasks
            </Link>
          </div>
          {overdueTasks.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No overdue tasks. Nice.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {overdueTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-lg border border-rose-200 p-3 dark:border-rose-900/60"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <p className="mt-1 font-medium">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <DueDateLabel dueDate={task.dueDate} />
                    <Link
                      href={`/projects/${task.projectId}`}
                      className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {task.project.name}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Project progress</h3>
          <Link
            href="/projects"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Manage projects
          </Link>
        </div>

        {projects.length === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No active projects yet.{" "}
            <Link href="/projects" className="font-medium underline">
              Create your first project
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {projects.map((project) => {
              const done = project.tasks.filter(
                (task) => task.status === "Done",
              ).length;
              return (
                <li key={project.id}>
                  <Link
                    href={`/projects/${project.id}`}
                    className="block rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {done}/{project.tasks.length} tasks done
                      </span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar
                        percent={projectProgress(project.tasks)}
                        label={project.name}
                      />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
