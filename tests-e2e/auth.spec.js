import { test, expect } from '@playwright/test'

test.describe('Authentication flow', () => {
    test('redirects unauthenticated user to /login', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByRole('heading', { name: 'Admin Dashboard' })).toBeVisible()
    })

    test('successful login navigates to dashboard', async ({ page }) => {
        // Intercept token endpoint
        await page.route('**/api/auth/token/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ access: 'fake-access', refresh: 'fake-refresh' }),
            })
        })

        // Intercept /auth/me
        await page.route('**/api/auth/me/**', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id: 1, username: 'admin', role: 'admin' }),
            })
        })

        await page.goto('/login')
        await page.fill('#username', 'admin')
        await page.fill('#password', 'admin1234')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/$/)
        await expect(page.getByText('Dashboard')).toBeVisible()
    })
})


