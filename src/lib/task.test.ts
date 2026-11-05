import { describe, expect, it } from "vitest";
import {
  dueDateBucket,
  isDueToday,
  isOverdue,
  isTaskPriority,
  isTaskStatus,
  projectProgress,
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
