import { test, expect } from '@playwright/test';

interface PageCase {
    name: string;
    route: string;
    viewport: { width: number; height: number };
    maxDiffPixelRatio: number;
}

const pages: PageCase[] = [
    {
        name: 'dashboard',
        route: '/experience',
        viewport: { width: 1440, height: 900 },
        maxDiffPixelRatio: 0.05,
    },
];

test.beforeAll(async ({ page }) => {
    await page.goto('/login');
});
for (const pageCase of pages) {
    test(`visual regression: ${pageCase.name}`, async ({ page }) => {
        await page.setViewportSize(pageCase.viewport);
        await page.goto(pageCase.route, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);

        await expect(page).toHaveScreenshot(`${pageCase.name}.png`, {
            fullPage: true,
            maxDiffPixelRatio: pageCase.maxDiffPixelRatio,
        });
    });
}
