import { formatDate, isDueToday, isOverdue } from "@/lib/task";

export function Alert({
  error,
  notice,
}: {
  error?: string;
  notice?: string;
}) {
  if (error) {
    return (
      <div
        role="alert"
        className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200"
      >
        {error}
      </div>
    );
  }

  if (notice) {
    return (
      <div
        role="status"
        className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200"
      >
        {notice}
      </div>
    );
  }

  return null;
}

const statusStyles: Record<string, string> = {
  Todo: "bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700",
  Doing:
    "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-900",
  Done: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900",
};

const priorityStyles: Record<string, string> = {
  high: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-900",
  medium:
    "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-900",
  low: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-900",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[status] ?? statusStyles.Todo}`}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${priorityStyles[priority] ?? priorityStyles.medium}`}
    >
      {priority}
    </span>
  );
}

export function DueDateLabel({
  dueDate,
  done = false,
}: {
  dueDate: Date | null;
  done?: boolean;
}) {
  if (!dueDate) {
    return (
      <span className="text-xs text-zinc-400 dark:text-zinc-500">
        No due date
      </span>
    );
  }

  const overdue = !done && isOverdue(dueDate);
  const today = !done && isDueToday(dueDate);
  const tone = overdue
    ? "text-rose-700 dark:text-rose-300"
    : today
      ? "text-amber-700 dark:text-amber-300"
      : "text-zinc-500 dark:text-zinc-400";

  return (
    <span className={`text-xs ${tone}`}>
      Due {formatDate(dueDate)}
      {overdue ? " - overdue" : today ? " - today" : ""}
    </span>
  );
}

export function ProgressBar({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span className="font-medium text-zinc-700 dark:text-zinc-200">
          {percent}%
        </span>
      </div>
      <div
        className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percent}% complete`}
      >
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
