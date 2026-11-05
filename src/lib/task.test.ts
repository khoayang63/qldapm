import { describe, expect, it } from "vitest";
import {
  compareTasksByPriorityAndDueDate,
  dueDateBucket,
  isDueToday,
  isOverdue,
  isTaskPriority,
  isTaskStatus,
  nextTaskStatus,
  parseDueDateInput,
  priorityRank,
  projectProgress,
  toDateInputValue,
} from "./task";

const now = new Date(2026, 10, 5, 15, 30);

describe("task enums", () => {
  it("recognizes valid statuses", () => {
    expect(isTaskStatus("Todo")).toBe(true);
    expect(isTaskStatus("Doing")).toBe(true);
    expect(isTaskStatus("Done")).toBe(true);
    expect(isTaskStatus("Archived")).toBe(false);
  });

  it("recognizes valid priorities", () => {
    expect(isTaskPriority("low")).toBe(true);
    expect(isTaskPriority("medium")).toBe(true);
    expect(isTaskPriority("high")).toBe(true);
    expect(isTaskPriority("urgent")).toBe(false);
  });
});

describe("status transitions", () => {
  it("moves Todo to Doing to Done and back to Todo", () => {
    expect(nextTaskStatus("Todo")).toBe("Doing");
    expect(nextTaskStatus("Doing")).toBe("Done");
    expect(nextTaskStatus("Done")).toBe("Todo");
  });
});

describe("priority ordering", () => {
  it("ranks high before medium before low", () => {
    expect(priorityRank("high")).toBeLessThan(priorityRank("medium"));
    expect(priorityRank("medium")).toBeLessThan(priorityRank("low"));
    expect(priorityRank("unknown")).toBe(99);
  });

  it("sorts by priority, then earliest due date, then title", () => {
    const tasks = [
      { title: "Low later", priority: "low", dueDate: new Date(2026, 10, 8) },
      { title: "High no date", priority: "high", dueDate: null },
      { title: "High sooner", priority: "high", dueDate: new Date(2026, 10, 6) },
      { title: "High later", priority: "high", dueDate: new Date(2026, 10, 9) },
    ];

    expect(tasks.sort(compareTasksByPriorityAndDueDate).map((task) => task.title))
      .toEqual(["High sooner", "High later", "High no date", "Low later"]);
  });
});

describe("due date helpers", () => {
  it("treats yesterday as overdue and today as not overdue", () => {
    expect(isOverdue(new Date(2026, 10, 4), now)).toBe(true);
    expect(isOverdue(new Date(2026, 10, 5), now)).toBe(false);
    expect(isOverdue(null, now)).toBe(false);
  });

  it("detects tasks due today", () => {
    expect(isDueToday(new Date(2026, 10, 5), now)).toBe(true);
    expect(isDueToday(new Date(2026, 10, 6), now)).toBe(false);
  });

  it("buckets due dates", () => {
    expect(dueDateBucket(null, now)).toBe("none");
    expect(dueDateBucket(new Date(2026, 10, 1), now)).toBe("overdue");
    expect(dueDateBucket(new Date(2026, 10, 5), now)).toBe("today");
    expect(dueDateBucket(new Date(2026, 10, 9), now)).toBe("upcoming");
  });

  it("parses YYYY-MM-DD input as a local date", () => {
    const parsed = parseDueDateInput("2026-11-05");
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(10);
    expect(parsed?.getDate()).toBe(5);
    expect(parseDueDateInput("")).toBeNull();
  });

  it("rejects malformed or impossible dates", () => {
    expect(() => parseDueDateInput("11/05/2026")).toThrow();
    expect(() => parseDueDateInput("2026-02-30")).toThrow();
    expect(() => parseDueDateInput("2026-13-01")).toThrow();
  });

  it("formats a date for an input value", () => {
    expect(toDateInputValue(new Date(2026, 0, 9))).toBe("2026-01-09");
    expect(toDateInputValue(null)).toBe("");
  });
});

describe("projectProgress", () => {
  it("returns the rounded percentage of done tasks", () => {
    expect(projectProgress([])).toBe(0);
    expect(projectProgress([{ status: "Done" }])).toBe(100);
    expect(
      projectProgress([
        { status: "Done" },
        { status: "Todo" },
        { status: "Doing" },
      ]),
    ).toBe(33);
  });
});
