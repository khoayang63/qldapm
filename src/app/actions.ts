"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  isTaskPriority,
  isTaskStatus,
  nextTaskStatus,
  parseDueDateInput,
} from "@/lib/task";

const PROJECTS_PATH = "/projects";
const TASKS_PATH = "/tasks";

function field(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function appendParam(path: string, key: string, value: string): string {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${key}=${encodeURIComponent(value)}`;
}

function fail(path: string, message: string): never {
  redirect(appendParam(path, "error", message));
}

function finish(path: string, message: string): never {
  revalidatePath("/", "layout");
  redirect(appendParam(path, "notice", message));
}

function safeReturnTo(formData: FormData, fallback: string = TASKS_PATH): string {
  const value = field(formData, "returnTo");
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  return fallback;
}

function readName(
  formData: FormData,
): { ok: true; name: string } | { ok: false; error: string } {
  const name = field(formData, "name");
  if (!name) return { ok: false, error: "Project name is required." };
  if (name.length > 80) {
    return { ok: false, error: "Project name must be 80 characters or fewer." };
  }
  return { ok: true, name };
}

type TaskValues = {
  title: string;
  notes: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
};

function readTaskInput(
  formData: FormData,
): { ok: true; value: TaskValues } | { ok: false; error: string } {
  const title = field(formData, "title");
  if (!title) return { ok: false, error: "Task title is required." };
  if (title.length > 200) {
    return { ok: false, error: "Task title must be 200 characters or fewer." };
  }

  const notes = field(formData, "notes");
  if (notes.length > 2000) {
    return { ok: false, error: "Notes must be 2000 characters or fewer." };
  }

  const status = field(formData, "status") || "Todo";
  if (!isTaskStatus(status)) {
    return { ok: false, error: "Choose a valid task status." };
  }

  const priority = field(formData, "priority") || "medium";
  if (!isTaskPriority(priority)) {
    return { ok: false, error: "Choose a valid task priority." };
  }

  let dueDate: Date | null;
  try {
    dueDate = parseDueDateInput(field(formData, "dueDate"));
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Invalid due date.",
    };
  }

  return {
    ok: true,
    value: {
      title,
      notes: notes || null,
      status,
      priority,
      dueDate,
    },
  };
}

export async function createProject(formData: FormData) {
  const name = readName(formData);
  if (!name.ok) fail(PROJECTS_PATH, name.error);

  const description = field(formData, "description");
  if (description.length > 500) {
    fail(PROJECTS_PATH, "Project description must be 500 characters or fewer.");
  }

  await prisma.project.create({
    data: { name: name.name, description: description || null },
  });

  finish(PROJECTS_PATH, "Project created.");
}

export async function renameProject(formData: FormData) {
  const id = field(formData, "id");
  if (!id) fail(PROJECTS_PATH, "Project not found.");

  const name = readName(formData);
  if (!name.ok) fail(PROJECTS_PATH, name.error);

  const result = await prisma.project.updateMany({
    where: { id },
    data: { name: name.name },
  });
  if (result.count === 0) fail(PROJECTS_PATH, "Project not found.");

  finish(PROJECTS_PATH, "Project renamed.");
}

export async function archiveProject(formData: FormData) {
  const id = field(formData, "id");
  if (!id) fail(PROJECTS_PATH, "Project not found.");

  const result = await prisma.project.updateMany({
    where: { id, archivedAt: null },
    data: { archivedAt: new Date() },
  });
  if (result.count === 0) {
    fail(PROJECTS_PATH, "Project not found or already archived.");
  }

  finish(PROJECTS_PATH, "Project archived.");
}

export async function createTask(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const projectId = field(formData, "projectId");
  if (!projectId) fail(returnTo, "Choose a project for this task.");

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, archivedAt: true },
  });
  if (!project) fail(returnTo, "Choose a valid project.");
  if (project.archivedAt) fail(returnTo, "This project is archived.");

  const input = readTaskInput(formData);
  if (!input.ok) fail(returnTo, input.error);

  await prisma.task.create({
    data: { projectId, ...input.value },
  });

  finish(returnTo, "Task created.");
}

export async function updateTask(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const id = field(formData, "id");
  if (!id) fail(returnTo, "Task not found.");

  const input = readTaskInput(formData);
  if (!input.ok) fail(returnTo, input.error);

  const result = await prisma.task.updateMany({
    where: { id },
    data: input.value,
  });
  if (result.count === 0) fail(returnTo, "Task not found.");

  finish(returnTo, "Task updated.");
}

export async function deleteTask(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const id = field(formData, "id");
  if (!id) fail(returnTo, "Task not found.");

  const result = await prisma.task.deleteMany({ where: { id } });
  if (result.count === 0) fail(returnTo, "Task not found.");

  finish(returnTo, "Task deleted.");
}

export async function advanceTaskStatus(formData: FormData) {
  const returnTo = safeReturnTo(formData);
  const id = field(formData, "id");
  if (!id) fail(returnTo, "Task not found.");

  const task = await prisma.task.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!task) fail(returnTo, "Task not found.");
  if (!isTaskStatus(task.status)) {
    fail(returnTo, "Task has an invalid status.");
  }

  const status = nextTaskStatus(task.status);
  await prisma.task.update({ where: { id }, data: { status } });

  finish(returnTo, `Task moved to ${status}.`);
}
