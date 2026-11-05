import Link from "next/link";
import { archiveProject, createProject, renameProject } from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import {
  dangerButtonClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
  summaryButtonClass,
  textInputClass,
} from "@/components/form-styles";
import { Alert, ProgressBar } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { formatDate, projectProgress } from "@/lib/task";

export const dynamic = "force-dynamic";

type SearchParams = {
  error?: string;
  notice?: string;
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const notice = typeof params.notice === "string" ? params.notice : undefined;

  const projects = await prisma.project.findMany({
    orderBy: { name: "asc" },
    include: { tasks: { select: { status: true } } },
  });

  const active = projects.filter((project) => !project.archivedAt);
  const archived = projects
    .filter((project) => project.archivedAt)
    .sort(
      (a, b) =>
        (b.archivedAt?.getTime() ?? 0) - (a.archivedAt?.getTime() ?? 0),
    );

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Projects
        </p>
        <h2 className="mt-1 text-3xl font-semibold tracking-tight">Projects</h2>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Create, rename, and archive projects. Progress comes from the tasks
          marked Done inside each project.
        </p>
      </header>

      <Alert error={error} notice={notice} />

      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold">New project</h3>
        <form
          action={createProject}
          className="mt-3 grid gap-3 sm:grid-cols-2"
          aria-label="Create a project"
        >
          <label className={labelClass}>
            Name
            <input
              type="text"
              name="name"
              required
              maxLength={80}
              placeholder="e.g. Website relaunch"
              className={textInputClass}
            />
          </label>
          <label className={labelClass}>
            Description (optional)
            <input
              type="text"
              name="description"
              maxLength={500}
              placeholder="What is this project about?"
              className={textInputClass}
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryButtonClass}>
              Create project
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">
          Active projects{" "}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({active.length})
          </span>
        </h3>

        {active.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            No active projects yet. Create one above to start tracking tasks.
          </p>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {active.map((project) => {
              const done = project.tasks.filter(
                (task) => task.status === "Done",
              ).length;
              return (
                <li
                  key={project.id}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate font-semibold">{project.name}</h4>
                      {project.description ? (
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {project.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                      {done}/{project.tasks.length} done
                    </span>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      percent={projectProgress(project.tasks)}
                      label={`${project.name} progress`}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className={secondaryButtonClass}
                    >
                      Open
                    </Link>

                    <details>
                      <summary className={summaryButtonClass}>Rename</summary>
                      <form
                        action={renameProject}
                        className="mt-2 flex flex-col gap-2 sm:flex-row"
                      >
                        <input type="hidden" name="id" value={project.id} />
                        <input
                          type="text"
                          name="name"
                          required
                          maxLength={80}
                          defaultValue={project.name}
                          aria-label="Project name"
                          className={textInputClass}
                        />
                        <button type="submit" className={secondaryButtonClass}>
                          Save
                        </button>
                      </form>
                    </details>

                    <form action={archiveProject}>
                      <input type="hidden" name="id" value={project.id} />
                      <ConfirmSubmitButton
                        message={`Archive "${project.name}"? Its tasks stay in the database.`}
                        className={dangerButtonClass}
                      >
                        Archive
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h3 className="text-lg font-semibold">
          Archived{" "}
          <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400">
            ({archived.length})
          </span>
        </h3>

        {archived.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
            Nothing archived. Archived projects disappear from the dashboard but
            keep their tasks.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {archived.map((project) => (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="min-w-0">
                  <p className="font-medium">{project.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Archived {formatDate(project.archivedAt)} -{" "}
                    {project.tasks.length} task
                    {project.tasks.length === 1 ? "" : "s"}
                  </p>
                </div>
                <Link
                  href={`/tasks?project=${project.id}`}
                  className={secondaryButtonClass}
                >
                  View tasks
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
