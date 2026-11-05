export const TASK_STATUSES = ["Todo", "Doing", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

const NEXT_TASK_STATUS: Record<TaskStatus, TaskStatus> = {
  Todo: "Doing",
  Doing: "Done",
  Done: "Todo",
};

const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
}

export function nextTaskStatus(status: TaskStatus): TaskStatus {
  return NEXT_TASK_STATUS[status];
}

export function priorityRank(priority: string): number {
  return isTaskPriority(priority) ? PRIORITY_RANK[priority] : 99;
}

export function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function isOverdue(
  dueDate: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!dueDate) return false;
  return startOfDay(dueDate).getTime() < startOfDay(now).getTime();
}

export function isDueToday(
  dueDate: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!dueDate) return false;
  return startOfDay(dueDate).getTime() === startOfDay(now).getTime();
}

export type DueDateBucket = "none" | "overdue" | "today" | "upcoming";

export function dueDateBucket(
  dueDate: Date | null | undefined,
  now: Date = new Date(),
): DueDateBucket {
  if (!dueDate) return "none";
  const due = startOfDay(dueDate).getTime();
  const today = startOfDay(now).getTime();
  if (due < today) return "overdue";
  if (due === today) return "today";
  return "upcoming";
}

export function parseDueDateInput(
  value: string | null | undefined,
): Date | null {
  const trimmed = value?.trim() ?? "";
  if (trimmed === "") return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) {
    throw new Error("Enter the due date as YYYY-MM-DD.");
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error("Enter a real calendar date.");
  }

  return date;
}

export function toDateInputValue(
  date: Date | null | undefined,
): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "No due date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function compareTasksByPriorityAndDueDate(
  a: { title: string; priority: string; dueDate: Date | null },
  b: { title: string; priority: string; dueDate: Date | null },
): number {
  const priority = priorityRank(a.priority) - priorityRank(b.priority);
  if (priority !== 0) return priority;

  if (a.dueDate && b.dueDate) {
    const due = a.dueDate.getTime() - b.dueDate.getTime();
    if (due !== 0) return due;
  } else if (a.dueDate) {
    return -1;
  } else if (b.dueDate) {
    return 1;
  }

  return a.title.localeCompare(b.title);
}

export function projectProgress(tasks: { status: string }[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((task) => task.status === "Done").length;
  return Math.round((done / tasks.length) * 100);
}
