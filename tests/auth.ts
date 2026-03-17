import { expect, type Page } from "@playwright/test";
import { getUserByRole, TEST_PASSWORD, type TestUser } from "./test-users";

async function logoutIfLoggedIn(page: Page) {
  const profileButton = page.getByRole("button", {
    name: "Open profile details",
  });
  if (!(await profileButton.isVisible())) return;

  await profileButton.click();
  await page.getByRole("button", { name: "Log Out" }).click({ timeout: 5_000 });
  await expect(page.getByRole("heading")).toContainText("Sign in to your account", {
    timeout: 10_000,
  });
}

/**
 * Log into the app via the Cognito hosted UI as a specific test user.
 */
export async function loginAsUser(page: Page, user: TestUser) {
  await page.goto("/login");
  await logoutIfLoggedIn(page);

  const continueWithCognitoButton = page.getByRole("button", {
    name: "Continue with Cognito",
  });
  if (await continueWithCognitoButton.isVisible()) {
    await continueWithCognitoButton.click();
  }

  const usernameTextbox = page.getByRole("textbox", { name: "Username" });
  const passwordTextbox = page.getByRole("textbox", { name: "Password" });
  await expect(usernameTextbox).toBeVisible({ timeout: 15_000 });
  await expect(passwordTextbox).toBeVisible({ timeout: 15_000 });
  await usernameTextbox.fill(user.username);
  await passwordTextbox.fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "submit" }).click();

  await expect(
    page.getByRole("button", { name: "Open profile details" }),
  ).toBeVisible({ timeout: 20_000 });
}

/**
 * Log into the app via the Cognito hosted UI as a specific role.
 */
export async function loginAs(
  page: Page,
  role: "student" | "advisor" | "admin",
) {
  await loginAsUser(page, getUserByRole(role));
}
