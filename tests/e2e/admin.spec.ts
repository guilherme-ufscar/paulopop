import { test, expect } from '@playwright/test'

test.describe('Autenticacao Admin', () => {
  test('redireciona para login ao acessar /admin sem autenticacao', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('pagina de login exibe formulario de credenciais', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('exibe erro com credenciais invalidas', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', 'invalido@test.com')
    await page.fill('input[type="password"]', 'senhaerrada')
    await page.click('button[type="submit"]')
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Fluxo de Lead', () => {
  test('formulario de contato na home preenche os campos principais', async ({ page }) => {
    await page.goto('/')

    const form = page.locator('form[aria-label*="contato"]').first()
    await form.scrollIntoViewIfNeeded()

    const nameInput = form.locator('input#firstName')
    const phoneInput = form.locator('input#phone')

    await expect(nameInput).toBeVisible()
    await expect(phoneInput).toBeVisible()

    await nameInput.fill('Teste Playwright')
    await phoneInput.fill('11999999999')
  })
})
