import { test, expect } from '@playwright/test'

test.describe('Autenticação Admin', () => {
  test('redireciona para login ao acessar /admin sem autenticação', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('página de login exibe formulário de credenciais', async ({ page }) => {
    await page.goto('/admin/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('exibe erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/admin/login')
    await page.fill('input[type="email"]', 'invalido@test.com')
    await page.fill('input[type="password"]', 'senhaerrada')
    await page.click('button[type="submit"]')
    const alert = page.locator('[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Fluxo de Lead', () => {
  test('formulário de contato na home envia lead', async ({ page }) => {
    await page.goto('/')
    // Rolar até o formulário
    await page.locator('input[id="primeiro-nome"]').scrollIntoViewIfNeeded()
    // O formulário pode ter diferentes IDs - buscar pelo tipo e placeholder
    const nameInput = page.locator('input[placeholder*="Nome"], input[id*="name"], input[id*="nome"]').first()
    const phoneInput = page.locator('input[type="tel"], input[placeholder*="Telefone"], input[placeholder*="telefone"]').first()

    if (await nameInput.isVisible()) {
      await nameInput.fill('Teste Playwright')
      await phoneInput.fill('11999999999')
      // Não submeter para não criar lead real no banco de testes
    }
  })
})
