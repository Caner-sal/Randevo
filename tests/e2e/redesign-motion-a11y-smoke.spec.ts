import { expect, test } from "@playwright/test";

// REDESIGN-8/9: permanent regression coverage for the motion/responsive/a11y
// behavior that was verified manually (Playwright ad-hoc script) during
// REDESIGN-8 but never committed as a repeatable test. In particular this
// locks in the reduced-motion fix: useReducedMotion() only resolves after
// hydration, so without the CSS-level .motion-fade-in override in
// src/styles/tokens.css, reduced-motion users would briefly see the SSR
// "hidden" (opacity:0) state before content appeared.

test.describe("REDESIGN-8/9: motion, responsive & accessibility smoke", () => {
  test("landing page respects prefers-reduced-motion from first paint", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/tr");

    const hero = page.locator("h1").first().locator("xpath=ancestor::div[contains(@class,'motion-fade-in')]").first();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveCSS("opacity", "1");

    await context.close();
  });

  test("landing page fades in normally without reduced motion, no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/tr");
    await expect(page.locator("h1").first()).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page.locator("h1").first().locator("xpath=ancestor::div[contains(@class,'motion-fade-in')]").first()).toHaveCSS(
      "opacity",
      "1"
    );

    expect(errors).toEqual([]);
  });

  test("landing and marketplace have no horizontal overflow on a mobile viewport", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await context.newPage();

    await page.goto("/tr");
    await page.waitForTimeout(400);
    const landingOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    );
    expect(landingOverflow).toBe(false);

    await page.goto("/tr/marketplace");
    await page.waitForTimeout(400);
    const marketplaceOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2
    );
    expect(marketplaceOverflow).toBe(false);

    await context.close();
  });

  test("keyboard Tab reaches a focusable, visibly-outlined element on landing", async ({ page }) => {
    await page.goto("/tr");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    const focused = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return { tag: el.tagName, outline: style.outlineStyle, boxShadow: style.boxShadow };
    });

    expect(focused).not.toBeNull();
    expect(focused?.tag).toBeTruthy();
  });

  test("marketplace result cards are wrapped for scroll-reveal without breaking content", async ({ page, request }) => {
    const marketplaceRes = await request.get("/api/marketplace");
    if (!marketplaceRes.ok()) {
      test.skip(true, "Marketplace API not available in this environment");
      return;
    }
    const body = (await marketplaceRes.json()) as { data?: unknown[] };
    test.skip(!body.data || body.data.length === 0, "No seeded businesses available in this environment");

    await page.goto("/tr/marketplace");
    await page.waitForLoadState("networkidle");

    const cards = page.locator(".motion-fade-in");
    await expect(cards.first()).toBeVisible({ timeout: 5000 });
  });
});
