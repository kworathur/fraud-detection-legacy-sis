import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.getByRole('button', { name: 'Continue with Cognito' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('admin1');
    await page.getByRole('textbox', { name: 'Username' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('TestPass123!');
    await page.getByRole('button', { name: 'submit' }).click();
    await expect(async () => {
        await page
            .getByRole('button', { name: 'Open profile details' })
            .click();
        await page
            .getByRole('button', { name: 'Log Out' })
            .click({ timeout: 5000 });
        await expect(page.getByRole('heading')).toContainText(
            'Sign in to your account',
            { timeout: 10000 }
        );
    }).toPass();
});
