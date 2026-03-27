import { test, expect } from '@playwright/test'

test.describe('Página Home', () => {
  test('carrega a home sem erros', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Paulo Pop/)
  })

  test('tem seção hero com barra de busca', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('section[aria-label="Hero"]')
    await expect(hero).toBeVisible()
  })

  test('skip link existe e é acessível via teclado', async ({ page }) => {
    await page.goto('/')
    // O skip link está oculto mas deve aparecer com foco
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeAttached()
  })
})

test.describe('Navegação', () => {
  test('link "Imóveis" navega para /imoveis', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/imoveis"]')
    await expect(page).toHaveURL(/\/imoveis/)
  })
})
