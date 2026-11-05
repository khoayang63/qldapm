# qldapm

qldapm is a focused, single-user web app for tracking projects and their tasks.
It runs locally against SQLite, ships with demo data, and keeps the whole loop
in one place: plan a project, add tasks, move them across Todo / Doing / Done,
and see what is due today and what has slipped.

**Status:** core MVP. Projects, tasks, the dashboard, filters, validation, and
SQLite persistence are implemented. The remaining milestone is independent test
and review sign-off.

## Stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Prisma](https://www.prisma.io/) + SQLite
- [Vitest](https://vitest.dev/) for unit tests
- [Playwright](https://playwright.dev/) for one end-to-end smoke test
- ESLint

## Requirements

- Node.js 22 or newer
- npm 10 or newer

## Setup

```bash
git clone https://github.com/khoayang63/qldapm.git
cd qldapm
npm install

# Create the local environment file (the default points at prisma/dev.db).
cp .env.example .env

# Create the SQLite database and apply the schema.
npx prisma migrate dev

# Load the demo projects and tasks.
npm run seed

npm run dev
```

Open <http://localhost:3000>.

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

`prisma migrate dev` runs the seed automatically the first time it applies a
migration. Run `npm run seed` whenever you want to reset the demo data.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server on port 3000. |
| `npm run build` | Build the production bundle. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm run typecheck` | Run the TypeScript compiler with no emit. |
| `npm test` | Run the Vitest unit tests once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:e2e` | Run the Playwright smoke test (see below). |
| `npm run seed` | Reset and load the demo data. |
| `npm run db:migrate` | Create and apply a Prisma migration in development. |

## What is included

- **Projects:** create, rename, and archive projects. Each card shows completion
  progress from its tasks. Archived projects leave the dashboard and the active
  list but keep their tasks.
- **Tasks:** title, optional notes, status (Todo / Doing / Done), priority
  (low / medium / high), and due date. Create, edit, advance, reopen, and delete
  from the task list or a project page.
- **Dashboard:** counts for due today, overdue, and active projects; a due-today
  list; an overdue list; and per-project progress bars.
- **Task list:** filter by project and status, with clear empty states when
  there is no data or no match.
- **Validation:** required project names and task titles, length limits, valid
  status and priority values, and real calendar dates for due dates. Every
  mutation is revalidated on the server through Next.js server actions.
- **Persistence:** SQLite through Prisma, with a committed initial migration and
  a seed script with realistic demo data.

## Project structure

```
prisma/
  schema.prisma        Project and Task models
  seed.ts              Demo projects and tasks
  migrations/          Committed SQLite migrations
e2e/
  smoke.spec.ts        Playwright smoke test
src/
  app/
    actions.ts         Server actions for project and task mutations
    layout.tsx         App shell and navigation
    page.tsx           Dashboard
    projects/
      page.tsx         Project list, create/rename/archive
      [id]/page.tsx    Project detail with tasks and progress
    tasks/page.tsx     Filterable task list and task editor
  components/
    form-styles.ts     Shared form class names
    site-nav.tsx       Sidebar navigation
    task-create-form.tsx
    task-row.tsx       Task display, advance, edit, delete
    ui.tsx             Badges, progress bars, alerts
  lib/
    prisma.ts          Prisma client singleton
    task.ts            Status/priority types, transitions, date/progress helpers
    task.test.ts       Vitest unit tests
```

## Data model

- **Project:** `id`, `name`, `description`, `archivedAt`, `createdAt`,
  `updatedAt`. Deleting a project cascades to its tasks.
- **Task:** `id`, `projectId`, `title`, `notes`, `status`
  (`Todo` / `Doing` / `Done`), `priority` (`low` / `medium` / `high`),
  `dueDate`, `createdAt`, `updatedAt`.

SQLite does not support native enums through Prisma, so `status` and `priority`
are stored as validated strings. The allowed values and helpers live in
`src/lib/task.ts`.

## Demo walkthrough

1. Run the setup commands above, then start the app with `npm run dev` and open
   <http://localhost:3000>. The dashboard should show one task due today, one
   overdue task, three active projects, and progress bars for each.
2. Open **Projects**. Create a project such as "Demo launch". Rename it from its
   card, then open it. The new project starts at 0% with no tasks.
3. On the project page, add a task titled "Write the launch note" with priority
   **high** and a due date of today. It appears under the project and contributes
   to the dashboard's due-today list.
4. Open **Tasks**. Filter by the new project, then advance the task with
   **Start** and **Mark done**. Its badge moves Todo -> Doing -> Done, and the
   project progress becomes 100%. Edit the task to try another priority, then
   delete it to confirm the empty state.
5. Back on **Projects**, archive the demo project. It moves to the Archived
   section; the dashboard and active list no longer show it. Run `npm run seed`
   at any time to restore the original demo data.

## Testing

```bash
npm test        # Vitest unit tests: status transitions, priority ordering,
                # due-date buckets/parsing, and project progress
npm run lint
npm run typecheck
```

The Playwright smoke test starts the dev server automatically:

```bash
npx playwright install chromium   # once per machine
npm run test:e2e
```

## Scope

In scope for the MVP: projects (create, rename, archive, progress), tasks
(create, edit, delete, status, priority, due date), dashboard of today and
overdue work, a filterable task list, local SQLite persistence, seed data, and
this README.

Out of scope: multi-user auth, collaboration, notifications, mobile apps,
billing, and production deployment.

## Environment

`DATABASE_URL` is the only required variable. The example value,
`file:./dev.db`, resolves relative to `prisma/schema.prisma`, so the database
lives at `prisma/dev.db`. The database file and `.env` are gitignored; no secrets
belong in this repository.
