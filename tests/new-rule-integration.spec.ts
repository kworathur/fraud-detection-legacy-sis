import { expect, test } from "@playwright/test";
import { loginAs } from "./auth";

test("new rule form posts to rules endpoint with expected payload", async ({
  page,
}) => {
  await loginAs(page, "admin");

  let postedPayload:
    | {
        advisorId: string;
        conditionType: string;
        parameters: { start?: string; end?: string };
        priority: number;
        isActive: boolean;
      }
    | undefined;

  await page.route("**/api/quaid/advising/admin/advisors?*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        data: [
          {
            advisorId: "advisor-123",
            username: "advisor.user",
            email: "advisor@example.edu",
            name: "Advisor Demo",
            enabled: true,
            status: "ACTIVE",
          },
        ],
        pagination: { offset: 0, limit: 60, currentPage: 1 },
        links: { self: "", prev: null, next: null },
      }),
    });
  });

  await page.route("**/api/quaid/advising/admin/rules", async (route) => {
    const requestBody = route.request().postData();
    postedPayload = requestBody
      ? (JSON.parse(requestBody) as typeof postedPayload)
      : undefined;

    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ ruleId: "rule-1" }),
    });
  });

  await page.goto("/advising-configuration/new-rule");
  await page.locator('input[maxlength="1"]').nth(0).fill("A");
  await page.locator('input[maxlength="1"]').nth(1).fill("D");
  await page.locator("select").nth(1).selectOption("advisor-123");
  await page.locator('input[type="text"]').last().fill("3");
  await page.getByRole("button", { name: "CREATE RULE" }).click();

  await expect(page).toHaveURL(/\/advising-configuration(\?created=1)?$/);
  expect(postedPayload).toEqual({
    advisorId: "advisor-123",
    conditionType: "LAST_NAME_RANGE",
    parameters: { start: "A", end: "D" },
    priority: 3,
    isActive: true,
  });
});
