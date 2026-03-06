import { test, expect } from "@playwright/test";
import { loginAs } from "./auth";

test("student can log in and log out", async ({ page }) => {
  await loginAs(page, "student");

  await page.getByRole("button", { name: "Open profile details" }).click();
  await page.getByRole("button", { name: "Log Out" }).click({ timeout: 5000 });
  await expect(page.getByRole("heading")).toContainText(
    "Sign in to your account",
    { timeout: 10000 },
  );
});

test("advisor can log in and log out", async ({ page }) => {
  await loginAs(page, "advisor");

  await page.getByRole("button", { name: "Open profile details" }).click();
  await page.getByRole("button", { name: "Log Out" }).click({ timeout: 5000 });
  await expect(page.getByRole("heading")).toContainText(
    "Sign in to your account",
    { timeout: 10000 },
  );
});

test("admin can log in and log out", async ({ page }) => {
  await loginAs(page, "admin");

  await page.getByRole("button", { name: "Open profile details" }).click();
  await page.getByRole("button", { name: "Log Out" }).click({ timeout: 5000 });
  await expect(page.getByRole("heading")).toContainText(
    "Sign in to your account",
    { timeout: 10000 },
  );
});
