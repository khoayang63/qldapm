import Link from "next/link";
import {
  advanceTaskStatus,
  deleteTask,
  updateTask,
} from "@/app/actions";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import {
  dangerButtonClass,
  labelClass,
  secondaryButtonClass,
  selectClass,
  summaryButtonClass,
  textareaClass,
  textInputClass,
} from "@/components/form-styles";
import {
  DueDateLabel,
  PriorityBadge,
  StatusBadge,
} from "@/components/ui";
import {
  isTaskStatus,
  nextTaskStatus,
  TASK_PRIORITIES,
  TASK_STATUSES,
  toDateInputValue,
} from "@/lib/task";

type TaskRowTask = {
  id: string;
  title: string;
  notes: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  project?: { id: string; name: string; archivedAt: Date | null } | null;
};

export function TaskRow({
  task,
  returnTo,
  showProject = false,
}: {
  task: TaskRowTask;
  returnTo: string;
  showProject?: boolean;
}) {
  const nextStatus = isTaskStatus(task.status)
    ? nextTaskStatus(task.status)
    : "Doing";
  const advanceLabel =
    task.status === "Done"
      ? "Reopen"
      : nextStatus === "Done"
        ? "Mark done"
        : "Start";

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            {showProject && task.project ? (
              <Link
                href={`/projects/${task.project.id}`}
                className="text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                {task.project.name}
              </Link>
            ) : null}
          </div>
          <h3 className="mt-2 font-medium text-zinc-900 dark:text-zinc-100">
            {task.title}
          </h3>
          {task.notes ? (
            <p className="mt-1 whitespace-pre-line text-sm text-zinc-600 dark:text-zinc-400">
              {task.notes}
            </p>
          ) : null}
          <div className="mt-2">
            <DueDateLabel
              dueDate={task.dueDate}
              done={task.status === "Done"}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <form action={advanceTaskStatus}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button type="submit" className={secondaryButtonClass}>
              {advanceLabel}
            </button>
          </form>
          <form action={deleteTask}>
            <input type="hidden" name="id" value={task.id} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <ConfirmSubmitButton
              message={`Delete "${task.title}"?`}
              className={dangerButtonClass}
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <details className="mt-3">
        <summary className={summaryButtonClass}>Edit task</summary>
        <form
          action={updateTask}
          className="mt-3 grid gap-3 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2 dark:border-zinc-800"
        >
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="returnTo" value={returnTo} />

          <label className={`${labelClass} sm:col-span-2`}>
            Title
            <input
              type="text"
              name="title"
              required
              maxLength={200}
              defaultValue={task.title}
              className={textInputClass}
            />
          </label>

          <label className={`${labelClass} sm:col-span-2`}>
            Notes
            <textarea
              name="notes"
              maxLength={2000}
              defaultValue={task.notes ?? ""}
              className={textareaClass}
            />
          </label>

          <label className={labelClass}>
            Status
            <select
              name="status"
              defaultValue={task.status}
              className={selectClass}
            >
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Priority
            <select
              name="priority"
              defaultValue={task.priority}
              className={selectClass}
            >
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className={labelClass}>
            Due date
            <input
              type="date"
              name="dueDate"
              defaultValue={toDateInputValue(task.dueDate)}
              className={textInputClass}
            />
          </label>

          <div className="flex items-end justify-end">
            <button type="submit" className={secondaryButtonClass}>
              Save changes
            </button>
          </div>
        </form>
      </details>
    </li>
  );
}
