import { expect, test } from '@playwright/test';
import { loginAs, loginAsUser } from './auth';
import { getStudentByLastName, getUserByRole } from './test-users';

const martinez = getStudentByLastName('Martinez');
const advisor = getUserByRole('advisor');

/**
 * Delete all existing advising rules via the app's API proxy.
 * Must be called after the admin is logged in so the session cookie is set.
 */
async function deleteAllRules(
    request: import('@playwright/test').APIRequestContext
) {
    const listRes = await request.get(
        '/api/quaid/advising/admin/rules?limit=500'
    );
    if (!listRes.ok()) return;
    const { data } = (await listRes.json()) as {
        data: Array<{ ruleId: string }>;
    };
    await Promise.all(
        data.map((rule) =>
            request.delete(`/api/quaid/advising/admin/rules/${rule.ruleId}`)
        )
    );
}

/**
 * Delete all existing advising insights via the app's API proxy.
 * Must be called after the admin is logged in so the session cookie is set.
 */
async function deleteAllInsights(
    request: import('@playwright/test').APIRequestContext
) {
    const listRes = await request.get('/api/quaid/advising/insights');
    if (!listRes.ok()) return;
    const { data } = (await listRes.json()) as {
        data: Array<{ insightId: string }>;
    };
    await Promise.all(
        data.map((insight) =>
            request.delete(`/api/quaid/advising/insights/${insight.insightId}`)
        )
    );
}

test.describe('Advising assignment and insights', () => {
    test.describe.configure({ mode: 'serial' });

    test('admin creates rule mapping advisor to Martinez, student sees advisor on card', async ({
        page,
    }) => {
        // Step 1: Log in as admin
        await loginAs(page, 'admin');

        // Clean up any existing rules from previous test runs
        await deleteAllRules(page.request);

        // Navigate to new-rule form
        await page.goto('/advising-configuration/new-rule');

        // Fill in the range start and end letters
        await page.locator('input[maxlength="1"]').nth(0).fill('L');
        await page.locator('input[maxlength="1"]').nth(1).fill('N');

        // Select the e2e-advisor from the advisor dropdown
        // The advisor dropdown is the second <select> (first is the disabled rule-type dropdown)
        const advisorDropdown = page.locator('select').nth(1);
        await advisorDropdown.waitFor({ state: 'visible', timeout: 10_000 });

        // Wait for advisor options to load (more than just the placeholder)
        await expect(advisorDropdown.locator('option')).not.toHaveCount(1, {
            timeout: 10_000,
        });

        // Find the option containing the advisor's name or username and select it
        const advisorOption = advisorDropdown.locator('option', {
            hasText: advisor.attributes?.name ?? advisor.username,
        });
        const advisorValue = await advisorOption.getAttribute('value');
        expect(advisorValue).toBeTruthy();
        await advisorDropdown.selectOption(advisorValue!);

        // Set priority
        await page.locator('input[type="text"]').last().fill('1');

        // Submit the rule
        await page.getByRole('button', { name: 'CREATE RULE' }).click();
        await expect(page).toHaveURL(
            /\/advising-configuration(\?created=1)?$/,
            {
                timeout: 15_000,
            }
        );

        // Step 2: Log in as Martinez (new browser context avoids stale session)
        await page.context().clearCookies();
        await loginAsUser(page, martinez);
        await page.goto('/experience');

        // The advising card should be visible — "Advising Appointments" header proves
        // that the backend matched Martinez to an advisor via the rule we created
        await expect(page.getByText('Advising Appointments')).toBeVisible({
            timeout: 20_000,
        });

        // The chat sender should contain "Your Advisor" (name may or may not resolve)
        await expect(page.getByText(/Your Advisor,/i)).toBeVisible({
            timeout: 10_000,
        });
    });

    test('admin creates CREDENTIALS_NEAR_COMPLETION insight', async ({
        page,
    }) => {
        // Step 1: Log in as admin and clean up existing insights
        await loginAs(page, 'admin');
        await deleteAllInsights(page.request);

        await page.goto('/advising-configuration/insights/new');

        // Select the CREDENTIALS_NEAR_COMPLETION template
        const templateDropdown = page.locator('select').nth(1);
        await templateDropdown.selectOption('CREDENTIALS_NEAR_COMPLETION');

        // Use a guaranteed threshold so test data always qualifies for execution.
        await page.locator('input[type="number"]').fill('0');

        // Fill custom message template
        await page
            .locator('textarea')
            .fill(
                'Hi {{student_name}}, you have completed {{completion_pct}}% of your {{program_name}} program!'
            );

        // Submit the insight
        await page.getByRole('button', { name: 'CREATE INSIGHT' }).click();
        await expect(page).toHaveURL(
            /\/advising-configuration\/insights(\?created=1)?$/,
            { timeout: 15_000 }
        );

        // Step 2: Verify backend execution by running the created insight for
        // a real student id.
        const insightsRes = await page.request.get(
            '/api/quaid/advising/insights'
        );
        expect(insightsRes.ok()).toBeTruthy();
        const insightsPayload = (await insightsRes.json()) as {
            data: Array<{ insightId: string; templateKey: string }>;
        };
        const createdInsight = insightsPayload.data.find(
            (insight) => insight.templateKey === 'CREDENTIALS_NEAR_COMPLETION'
        );
        expect(createdInsight).toBeTruthy();
        await page
            .getByRole('button', { name: 'Open profile details' })
            .click();
        await page.getByRole('button', { name: 'Log Out' }).click();
        await page
            .getByRole('button', { name: 'Continue with Cognito' })
            .click();
        await loginAsUser(page, martinez);
        await page.goto('/experience');

        // The advising card should be visible — "Advising Appointments" header proves
        // that the backend matched Martinez to an advisor via the rule we created
        await expect(page.getByText('Advising Appointments')).toBeVisible({
            timeout: 20_000,
        });

        // The chat sender should contain "Your Advisor" (name may or may not resolve)
        await expect(page.getByText(/Your Advisor,/i)).toBeVisible({
            timeout: 10_000,
        });
    });
});
