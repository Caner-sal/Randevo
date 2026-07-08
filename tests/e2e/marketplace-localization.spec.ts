import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const artifactDir = path.join(process.cwd(), "test-results", "marketplace-localization");

function ensureArtifactDir() {
  fs.mkdirSync(artifactDir, { recursive: true });
}

test.describe("Marketplace localization regression", () => {
  test("shows TR provinces only for Turkey and uses locality search for Italy", async ({ page }) => {
    ensureArtifactDir();

    await page.goto("/tr/marketplace");

    // After REDESIGN-4, category (index 0) and country (index 1) remain native
    // <select> elements, but province/district moved to Radix UI Select
    // (button[role="combobox"] triggers, no native <select>) — see
    // src/components/forms/ProvinceSelect.tsx / DistrictSelect.tsx.
    const countrySelect = page.locator("select").nth(1);
    await countrySelect.selectOption("TR");

    const provinceTrigger = page.locator("button[role='combobox']").first();
    await expect(provinceTrigger).toBeVisible();
    await provinceTrigger.click();
    await expect(page.getByRole("option", { name: "Adana" })).toHaveCount(1);
    await page.keyboard.press("Escape");
    await page.screenshot({
      path: path.join(artifactDir, "v1.6.2-tr-province-dropdown.png"),
      fullPage: true,
    });

    await countrySelect.selectOption("IT");
    await expect(page.locator("button[role='combobox']")).toHaveCount(0);

    const localityInput = page.getByPlaceholder(/locality/i);
    await expect(localityInput).toBeVisible();
    await page.screenshot({
      path: path.join(artifactDir, "v1.6.2-it-locality-input.png"),
      fullPage: true,
    });

    await localityInput.fill("Roma");

    const romaSuggestion = page.getByRole("button", { name: /Roma/i }).first();
    await expect(romaSuggestion).toBeVisible({ timeout: 10000 });
    await romaSuggestion.click();
    await expect(localityInput).toHaveValue(/Roma/i);
  });

  test("does not show Turkey-only landing copy in non-TR locale", async ({ page }) => {
    ensureArtifactDir();

    await page.goto("/en");
    await expect(page.locator("body")).not.toContainText(/T\u00FCrkiye MVP/i);
    await expect(page.locator("body")).not.toContainText(/81\s*T\u00FCrkiye Deste\u011Fi/i);
    await page.screenshot({
      path: path.join(artifactDir, "v1.6.2-en-landing-no-turkey-copy.png"),
      fullPage: true,
    });
  });
});
