import Link from "next/link";
import { TaskCreateForm } from "@/components/task-create-form";
import { TaskRow } from "@/components/task-row";
import {
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  selectClass,
} from "@/components/form-styles";
import { Alert } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { isTaskStatus, TASK_STATUSES } from "@/lib/task";

export const dynamic = "force-dynamic";

type SearchParams = {
  project?: string | string[];
  status?: string | string[];
  error?: string | string[];
  notice?: string | string[];
};

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const requestedProject = single(params.project);
  const requestedStatus = single(params.status);
  const error = single(params.error) || undefined;
  const notice = single(params.notice) || undefined;

  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, archivedAt: true },
  });

  const projectFilter = projects.some(
    (project) => project.id === requestedProject,
  )
    ? requestedProject
    : "";
  const statusFilter = isTaskStatus(requestedStatus) ? requestedStatus : "";
  const filtersActive = Boolean(projectFilter || statusFilter);

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectFilter ? { projectId: projectFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
    },
    include: { project: true },
    orderBy: { updatedAt: "desc" },
  });

  const activeProjects = projects.filter((project) => !project.archivedAt);

  const query = new URLSearchParams();
  if (projectFilter) query.set("project", projectFilter);
  if (statusFilter) query.set("status", statusFilter);
  const queryString = query.toString();
  const returnTo = queryString ? `/tasks?${queryString}` : "/tasks";

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Tasks
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">All tasks</h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Track every task across projects. Filter by project and status, then
          edit or move work forward.
        </p>
      </header>

      <Alert error={error} notice={notice} />

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold">Filters</h3>
        <form
          method="get"
          action="/tasks"
          className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
          aria-label="Filter tasks"
        >
          <label className={`${labelClass} sm:w-56`}>
            Project
            <select
              name="project"
              defaultValue={projectFilter}
              className={selectClass}
            >
              <option value="">All projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                  {project.archivedAt ? " (archived)" : ""}
                </option>
              ))}
            </select>
          </label>

          <label className={`${labelClass} sm:w-44`}>
            Status
            <select
              name="status"
              defaultValue={statusFilter}
              className={selectClass}
            >
              <option value="">All statuses</option>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <button type="submit" className={primaryButtonClass}>
              Apply filters
            </button>
            {filtersActive ? (
              <Link href="/tasks" className={secondaryButtonClass}>
                Clear
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold">Add a task</h3>
        {activeProjects.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Create an active project first.{" "}
            <Link href="/projects" className="font-medium underline">
              Go to projects
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3">
            <TaskCreateForm projects={activeProjects} returnTo={returnTo} />
          </div>
        )}
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">
          {filtersActive ? "Matching tasks" : "Tasks"}{" "}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({tasks.length})
          </span>
        </h3>

        {tasks.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {filtersActive ? (
              <>
                No tasks match these filters.{" "}
                <Link href="/tasks" className="font-medium underline">
                  Clear filters
                </Link>
                .
              </>
            ) : (
              <>No tasks yet. Add one above to get started.</>
            )}
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                returnTo={returnTo}
                showProject
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
