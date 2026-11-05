import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, ProgressBar } from "@/components/ui";
import { TaskCreateForm } from "@/components/task-create-form";
import { TaskRow } from "@/components/task-row";
import { prisma } from "@/lib/prisma";
import { formatDate, projectProgress } from "@/lib/task";

export const dynamic = "force-dynamic";

type SearchParams = {
  error?: string | string[];
  notice?: string | string[];
};

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const error = single(query.error) || undefined;
  const notice = single(query.notice) || undefined;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: { orderBy: { updatedAt: "desc" } } },
  });

  if (!project) notFound();

  const done = project.tasks.filter((task) => task.status === "Done").length;
  const returnTo = `/projects/${project.id}`;

  return (
    <div className="mx-auto max-w-5xl">
      <div>
        <Link
          href="/projects"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          &larr; All projects
        </Link>
      </div>

      <header className="mt-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">
            {project.name}
          </h2>
          {project.archivedAt ? (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              Archived {formatDate(project.archivedAt)}
            </span>
          ) : null}
        </div>
        {project.description ? (
          <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
            {project.description}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span>
            {done}/{project.tasks.length} tasks done
          </span>
          <Link
            href={`/tasks?project=${project.id}`}
            className="font-medium underline-offset-2 hover:underline"
          >
            Open in task list
          </Link>
        </div>
      </header>

      <Alert error={error} notice={notice} />

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <ProgressBar
          percent={projectProgress(project.tasks)}
          label={`${project.name} progress`}
        />
      </section>

      {project.archivedAt ? (
        <p className="mt-6 rounded-xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          This project is archived. New tasks cannot be added, but existing
          tasks remain available.
        </p>
      ) : (
        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-lg font-semibold">Add a task</h3>
          <div className="mt-3">
            <TaskCreateForm
              projects={[]}
              projectId={project.id}
              returnTo={returnTo}
            />
          </div>
        </section>
      )}

      <section className="mt-8">
        <h3 className="text-lg font-semibold">
          Tasks{" "}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({project.tasks.length})
          </span>
        </h3>

        {project.tasks.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            {project.archivedAt
              ? "This project has no tasks."
              : "No tasks yet. Add one above to start tracking progress."}
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {project.tasks.map((task) => (
              <TaskRow key={task.id} task={task} returnTo={returnTo} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
