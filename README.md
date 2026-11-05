# qldapm

qldapm is a focused, single-user web app for tracking projects and their tasks.

**Status:** scaffold. The app shell, database schema, seed data, and tooling are
in place. Project and task CRUD plus the live dashboard are built in the next
milestone.

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
    layout.tsx         App shell and navigation
    page.tsx           Dashboard placeholder
    tasks/page.tsx     Task list placeholder
    projects/page.tsx  Project list placeholder
  components/
    site-nav.tsx       Sidebar navigation
  lib/
    prisma.ts          Prisma client singleton
    task.ts            Status/priority types and date/progress helpers
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

The scaffold ships the shell and demo data. Use these steps to confirm the setup:

1. Run the setup commands above and start the dev server.
2. Open <http://localhost:3000> and check the dashboard shell renders.
3. Open **Tasks** and **Projects** from the sidebar to confirm navigation.
4. Run `npm run seed` again; the console should report `4 projects and 11 tasks`.
5. Run `npm test` to execute the unit tests.

A full click-through demo (create a project, add a task, move it to Done, check
dashboard counts) is added with the core MVP and finalized in the test/demo
milestone.

## Testing

```bash
npm test        # Vitest unit tests
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
