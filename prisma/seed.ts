import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const qldapm = await prisma.project.create({
    data: {
      name: "qldapm MVP",
      description:
        "Ship a focused, single-user project and task tracker that runs locally.",
      tasks: {
        create: [
          {
            title: "Scaffold the Next.js app",
            notes:
              "Next.js App Router, TypeScript, Tailwind, Prisma, and SQLite.",
            status: "Done",
            priority: "high",
            dueDate: daysFromNow(-2),
          },
          {
            title: "Build projects and task flows",
            notes: "Create, rename, and archive projects; add and edit tasks.",
            status: "Doing",
            priority: "high",
            dueDate: daysFromNow(0),
          },
          {
            title: "Add dashboard and task filters",
            notes: "Today and overdue views, plus a filterable task list.",
            status: "Todo",
            priority: "medium",
            dueDate: daysFromNow(2),
          },
          {
            title: "Write the demo runbook",
            notes: "Keep the README walkthrough reproducible from a clean checkout.",
            status: "Todo",
            priority: "low",
            dueDate: daysFromNow(5),
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      name: "Website relaunch",
      description: "Refresh the marketing site and publish the new case studies.",
      tasks: {
        create: [
          {
            title: "Draft the landing page copy",
            notes: "Tighten the hero section and the three feature blurbs.",
            status: "Done",
            priority: "medium",
            dueDate: daysFromNow(-6),
          },
          {
            title: "Collect two customer quotes",
            notes: "Ask the design partners for a one-line testimonial.",
            status: "Doing",
            priority: "high",
            dueDate: daysFromNow(-1),
          },
          {
            title: "Fix mobile navigation",
            notes: "Menu overlaps the logo below 360px wide.",
            status: "Todo",
            priority: "high",
            dueDate: daysFromNow(1),
          },
          {
            title: "Publish the case study page",
            notes: "Use the refreshed screenshots once design signs off.",
            status: "Todo",
            priority: "low",
            dueDate: null,
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      name: "Team offsite",
      description: "Plan the two-day offsite: venue, agenda, and travel.",
      tasks: {
        create: [
          {
            title: "Book the venue",
            notes: "Confirm the deposit and the AV setup.",
            status: "Done",
            priority: "high",
            dueDate: daysFromNow(-10),
          },
          {
            title: "Share the agenda",
            notes: "Collect session ideas from the team first.",
            status: "Todo",
            priority: "medium",
            dueDate: daysFromNow(4),
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      name: "Old pricing experiment",
      description: "Archived after the pricing direction changed.",
      archivedAt: daysFromNow(-30),
      tasks: {
        create: [
          {
            title: "Summarize the experiment results",
            status: "Done",
            priority: "low",
            dueDate: daysFromNow(-20),
          },
        ],
      },
    },
  });

  const projects = await prisma.project.count();
  const tasks = await prisma.task.count();
  console.log(`Seeded ${projects} projects and ${tasks} tasks.`);
  console.log(`Demo project: ${qldapm.name}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
