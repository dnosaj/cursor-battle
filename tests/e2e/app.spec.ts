import { test, expect } from '@playwright/test';

test.describe('AI Agent Policies Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays the correct title and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('AI Agent Policies');
    await expect(page.locator('p')).toContainText('An exercise in vibe coding');
  });

  test('shows default application buttons', async ({ page }) => {
    // Check that all three default apps are visible
    await expect(page.getByRole('button', { name: /Load Tempo application/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Load V0 application/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Load Figma application/i })).toBeVisible();
    
    // Check that logos are displayed
    await expect(page.locator('img[alt="Tempo logo"]')).toBeVisible();
    await expect(page.locator('img[alt="V0 logo"]')).toBeVisible();
    await expect(page.locator('img[alt="Figma logo"]')).toBeVisible();
  });

  test('shows empty state when no app is selected', async ({ page }) => {
    await expect(page.locator('text=No Application Selected')).toBeVisible();
    await expect(page.locator('text=Click on one of the application buttons')).toBeVisible();
  });

  test('loads application when button is clicked', async ({ page }) => {
    // Click on Tempo button
    await page.getByRole('button', { name: /Load Tempo application/i }).click();
    
    // Check that the iframe is loaded with correct URL
    const iframe = page.locator('iframe#app-iframe');
    await expect(iframe).toBeVisible();
    
    // Verify the URL in the header
    await expect(page.locator('text=c835d2d2-97e8-40cc-9f85-58e3260c091c.canvases.tempo.build')).toBeVisible();
    
    // Check that the button appears active
    await expect(page.getByRole('button', { name: /Load Tempo application/i })).toHaveClass(/active/);
  });

  test('switches between applications', async ({ page }) => {
    // Click on Tempo
    await page.getByRole('button', { name: /Load Tempo application/i }).click();
    await expect(page.locator('text=c835d2d2-97e8-40cc-9f85-58e3260c091c.canvases.tempo.build')).toBeVisible();
    
    // Click on V0
    await page.getByRole('button', { name: /Load V0 application/i }).click();
    await expect(page.locator('text=v0-agent-action-scope-composer.vercel.app')).toBeVisible();
    
    // Check that V0 button is now active and Tempo is not
    await expect(page.getByRole('button', { name: /Load V0 application/i })).toHaveClass(/active/);
    await expect(page.getByRole('button', { name: /Load Tempo application/i })).not.toHaveClass(/active/);
  });

  test('opens Add App modal when clicked', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    
    // Check modal is visible
    await expect(page.locator('text=Add New Application')).toBeVisible();
    await expect(page.locator('input[placeholder="e.g., My Custom App"]')).toBeVisible();
    await expect(page.locator('input[placeholder="https://example.com/my-app"]')).toBeVisible();
  });

  test('closes Add App modal with cancel button', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    await expect(page.locator('text=Add New Application')).toBeVisible();
    
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(page.locator('text=Add New Application')).not.toBeVisible();
  });

  test('closes Add App modal with X button', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    await expect(page.locator('text=Add New Application')).toBeVisible();
    
    await page.getByRole('button', { name: /Close modal/i }).click();
    await expect(page.locator('text=Add New Application')).not.toBeVisible();
  });

  test('closes Add App modal when clicking backdrop', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    await expect(page.locator('text=Add New Application')).toBeVisible();
    
    // Click on backdrop (the overlay)
    await page.locator('.fixed.inset-0.bg-black\\/50').click();
    await expect(page.locator('text=Add New Application')).not.toBeVisible();
  });

  test('validates form fields in Add App modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    
    // Try to submit empty form
    await page.getByRole('button', { name: /Add Application/i }).click();
    
    // Check validation errors
    await expect(page.locator('text=Application name is required')).toBeVisible();
    await expect(page.locator('text=Application URL is required')).toBeVisible();
  });

  test('validates URL format in Add App modal', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    
    // Fill invalid URL
    await page.fill('input[placeholder="e.g., My Custom App"]', 'Test App');
    await page.fill('input[placeholder="https://example.com/my-app"]', 'not-a-url');
    
    await page.getByRole('button', { name: /Add Application/i }).click();
    
    await expect(page.locator('text=Please enter a valid URL')).toBeVisible();
  });

  test('adds new application successfully', async ({ page }) => {
    await page.getByRole('button', { name: /Add New Application/i }).click();
    
    // Fill valid data
    await page.fill('input[placeholder="e.g., My Custom App"]', 'Test Application');
    await page.fill('input[placeholder="https://example.com/my-app"]', 'https://example.com');
    
    await page.getByRole('button', { name: /Add Application/i }).click();
    
    // Modal should close
    await expect(page.locator('text=Add New Application')).not.toBeVisible();
    
    // New button should appear
    await expect(page.getByRole('button', { name: /Load Test Application application/i })).toBeVisible();
  });

  test('can remove custom applications', async ({ page }) => {
    // First add an app
    await page.getByRole('button', { name: /Add New Application/i }).click();
    await page.fill('input[placeholder="e.g., My Custom App"]', 'Test App');
    await page.fill('input[placeholder="https://example.com/my-app"]', 'https://example.com');
    await page.getByRole('button', { name: /Add Application/i }).click();
    
    // Hover over the new app button to show remove button
    const appButton = page.getByRole('button', { name: /Load Test App application/i }).locator('..');
    await appButton.hover();
    
    // Click remove button
    await page.getByRole('button', { name: /Remove Test App/i }).click();
    
    // App should be removed
    await expect(page.getByRole('button', { name: /Load Test App application/i })).not.toBeVisible();
  });

  test('cannot remove default applications', async ({ page }) => {
    // Default apps should not have remove buttons
    const tempoButton = page.getByRole('button', { name: /Load Tempo application/i }).locator('..');
    await tempoButton.hover();
    
    await expect(page.getByRole('button', { name: /Remove Tempo/i })).not.toBeVisible();
  });

  test('has accessible keyboard navigation', async ({ page }) => {
    // Test tab navigation through buttons
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Load Tempo application/i })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Load V0 application/i })).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: /Load Figma application/i })).toBeFocused();
    
    // Test Enter key to activate button
    await page.keyboard.press('Enter');
    await expect(page.locator('text=cloud-raft-91473432.figma.site')).toBeVisible();
  });

  test('handles iframe loading errors gracefully', async ({ page }) => {
    // Add an app with an invalid URL that will cause iframe error
    await page.getByRole('button', { name: /Add New Application/i }).click();
    await page.fill('input[placeholder="e.g., My Custom App"]', 'Invalid App');
    await page.fill('input[placeholder="https://example.com/my-app"]', 'https://invalid-url-that-will-fail.com');
    await page.getByRole('button', { name: /Add Application/i }).click();
    
    // Click the invalid app
    await page.getByRole('button', { name: /Load Invalid App application/i }).click();
    
    // Should show error state eventually (may take a moment)
    await expect(page.locator('text=Failed to Load Application')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Try Again')).toBeVisible();
  });

  test('external link functionality works', async ({ page }) => {
    // Load an app first
    await page.getByRole('button', { name: /Load Tempo application/i }).click();
    
    // Check that external link button is present
    await expect(page.getByRole('link', { name: /Open in new tab/i })).toBeVisible();
    
    // The link should have correct attributes
    const externalLink = page.getByRole('link', { name: /Open in new tab/i });
    await expect(externalLink).toHaveAttribute('target', '_blank');
    await expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
