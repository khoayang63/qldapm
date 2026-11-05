import { expect, test } from "@playwright/test";

test("app shell renders", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "qldapm" })).toBeVisible();
  await expect(page.getByRole("navigation")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Dashboard", exact: true }),
  ).toBeVisible();
});
