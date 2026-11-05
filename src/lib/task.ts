export const TASK_STATUSES = ["Todo", "Doing", "Done"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export function isTaskStatus(value: string): value is TaskStatus {
  return (TASK_STATUSES as readonly string[]).includes(value);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return (TASK_PRIORITIES as readonly string[]).includes(value);
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

export function projectProgress(tasks: { status: string }[]): number {
  if (tasks.length === 0) return 0;
  const done = tasks.filter((task) => task.status === "Done").length;
  return Math.round((done / tasks.length) * 100);
}
