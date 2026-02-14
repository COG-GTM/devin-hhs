import { test, expect } from '@playwright/test';

test.describe('DEVIN//HHS Application', () => {
  test.describe('Homepage', () => {
    test('loads successfully with header', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('text=A NON-OFFICIAL WEBSITE')).toBeVisible();
      await expect(page.locator('text=DEVIN//HHS')).toBeVisible();
    });

    test('displays key statistics', async ({ page }) => {
      await page.goto('/');
      // Should show some statistics
      await expect(page.locator('body')).toContainText(/million|claims|providers/i, { timeout: 10000 });
    });

    test('has working navigation', async ({ page }) => {
      await page.goto('/');
      // Check for nav links (case-insensitive)
      await expect(page.locator('nav a, header a').first()).toBeVisible();
    });

    test('provider search form exists', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('input[placeholder*="NPI"]')).toBeVisible();
    });
  });

  test.describe('Explore Page', () => {
    test('loads with data table', async ({ page }) => {
      await page.goto('/explore');
      await expect(page.locator('body')).toContainText(/explore|data|provider/i, { timeout: 10000 });
    });

    test('displays provider data', async ({ page }) => {
      await page.goto('/explore');
      // Should show some data elements
      await expect(page.locator('table, [class*="table"], [class*="grid"]').first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Charts Page', () => {
    test('loads with visualizations', async ({ page }) => {
      await page.goto('/charts');
      await expect(page.locator('text=CHARTS & ANALYTICS')).toBeVisible();
    });

    test('displays time-based analysis section', async ({ page }) => {
      await page.goto('/charts');
      await expect(page.locator('text=Time-Based Analysis')).toBeVisible({ timeout: 15000 });
    });

    test('displays HCPCS analysis section', async ({ page }) => {
      await page.goto('/charts');
      await expect(page.locator('text=HCPCS Code Analysis')).toBeVisible({ timeout: 15000 });
    });

    test('displays geographic analysis section', async ({ page }) => {
      await page.goto('/charts');
      await expect(page.locator('text=Geographic Analysis')).toBeVisible({ timeout: 15000 });
    });

    test('shows chart data summary', async ({ page }) => {
      await page.goto('/charts');
      await expect(page.locator('text=Dataset Summary')).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('About Page', () => {
    test('loads with project description', async ({ page }) => {
      await page.goto('/about');
      await expect(page.locator('body')).toContainText(/about|medicaid|data/i, { timeout: 10000 });
    });

    test('has links to external resources', async ({ page }) => {
      await page.goto('/about');
      await expect(page.locator('a[href^="http"]').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('API Endpoints', () => {
    test('GET /api/stats returns data', async ({ request }) => {
      const response = await request.get('/api/stats');
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data).toHaveProperty('total_claims');
    });

    test('GET /api/charts returns chart data', async ({ request }) => {
      const response = await request.get('/api/charts');
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data).toHaveProperty('yearly');
      expect(data).toHaveProperty('topHCPCS');
      expect(data).toHaveProperty('topStates');
    });

    test('GET /api/providers returns provider list', async ({ request }) => {
      const response = await request.get('/api/providers');
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(Array.isArray(data)).toBeTruthy();
    });
  });

  test.describe('Provider Lookup', () => {
    test('provider detail page loads', async ({ page }) => {
      // Test with a known NPI pattern
      await page.goto('/provider/1234567890');
      // Should show provider page structure even if NPI not found
      await expect(page.locator('body')).toContainText(/provider|NPI|1234567890|not found/i, { timeout: 10000 });
    });
  });

  test.describe('Analysis Page', () => {
    test('loads with AI insights', async ({ page }) => {
      await page.goto('/analysis');
      await expect(page.locator('text=AI ANALYSIS')).toBeVisible({ timeout: 15000 });
    });

    test('displays executive summary', async ({ page }) => {
      await page.goto('/analysis');
      await expect(page.locator('text=EXECUTIVE SUMMARY')).toBeVisible({ timeout: 15000 });
    });

    test('shows insight cards', async ({ page }) => {
      await page.goto('/analysis');
      // Wait for insights to load (they depend on API)
      await expect(page.locator('text=Implication').first()).toBeVisible({ timeout: 20000 });
    });
  });

  test.describe('HCPCS Lookup', () => {
    test('HCPCS detail page loads', async ({ page }) => {
      await page.goto('/hcpcs/99213');
      await expect(page.locator('text=99213')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Responsive Design', () => {
    test('mobile viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await expect(page.locator('text=DEVIN//HHS')).toBeVisible();
    });

    test('tablet viewport works', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/charts');
      await expect(page.locator('text=CHARTS')).toBeVisible();
    });
  });

  test.describe('Federal Page', () => {
    test('loads with summary cards', async ({ page }) => {
      await page.goto('/federal');
      await expect(page.locator('text=FEDERAL FUNDING')).toBeVisible();
    });

    test('displays FMAP data', async ({ page }) => {
      await page.goto('/federal');
      await expect(page.locator('text=Avg FMAP')).toBeVisible({ timeout: 10000 });
    });

    test('shows expansion analysis', async ({ page }) => {
      await page.goto('/federal');
      await expect(page.locator('text=MEDICAID EXPANSION')).toBeVisible({ timeout: 10000 });
    });

    test('has working tabs', async ({ page }) => {
      await page.goto('/federal');
      await page.click('text=Charts');
      await expect(page.locator('text=TOP 10 STATES BY FMAP RATE')).toBeVisible({ timeout: 10000 });
    });

    test('federal analysis page loads', async ({ page }) => {
      await page.goto('/federal/analysis');
      await expect(page.locator('text=FEDERAL FUNDING ANALYSIS')).toBeVisible();
    });

    test('federal analysis has insights', async ({ page }) => {
      await page.goto('/federal/analysis');
      await expect(page.locator('text=Key Findings')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Federal API', () => {
    test('GET /api/federal returns data', async ({ request }) => {
      const response = await request.get('/api/federal');
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data).toHaveProperty('summary');
      expect(data.summary.totalStates).toBe(51);
    });

    test('GET /api/federal/analysis returns insights', async ({ request }) => {
      const response = await request.get('/api/federal/analysis');
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data).toHaveProperty('summary');
      expect(data).toHaveProperty('insights');
      expect(data.insights.length).toBeGreaterThan(0);
    });
  });

  test.describe('Performance', () => {
    test('homepage loads within 5 seconds', async ({ page }) => {
      const start = Date.now();
      await page.goto('/');
      await expect(page.locator('text=DEVIN//HHS')).toBeVisible();
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(5000);
    });

    test('charts API responds within 10 seconds', async ({ request }) => {
      const start = Date.now();
      const response = await request.get('/api/charts');
      expect(response.ok()).toBeTruthy();
      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(10000);
    });
  });
});
