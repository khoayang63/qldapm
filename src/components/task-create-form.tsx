import { createTask } from "@/app/actions";
import {
  labelClass,
  primaryButtonClass,
  selectClass,
  textareaClass,
  textInputClass,
} from "@/components/form-styles";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task";

export function TaskCreateForm({
  projects,
  projectId,
  returnTo,
}: {
  projects: { id: string; name: string }[];
  projectId?: string;
  returnTo: string;
}) {
  return (
    <form
      action={createTask}
      className="grid gap-3 sm:grid-cols-2"
      aria-label="Add a task"
    >
      <input type="hidden" name="returnTo" value={returnTo} />
      {projectId ? (
        <input type="hidden" name="projectId" value={projectId} />
      ) : null}

      <label className={`${labelClass} sm:col-span-2`}>
        Task title
        <input
          type="text"
          name="title"
          required
          maxLength={200}
          placeholder="What needs doing?"
          className={textInputClass}
        />
      </label>

      {projectId ? null : (
        <label className={labelClass}>
          Project
          <select name="projectId" required className={selectClass}>
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={labelClass}>
        Status
        <select name="status" defaultValue="Todo" className={selectClass}>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Priority
        <select name="priority" defaultValue="medium" className={selectClass}>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        Due date
        <input type="date" name="dueDate" className={textInputClass} />
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Notes (optional)
        <textarea
          name="notes"
          maxLength={2000}
          placeholder="Context, links, next steps..."
          className={textareaClass}
        />
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className={primaryButtonClass}>
          Add task
        </button>
      </div>
    </form>
  );
}
