import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function read(relPath: string) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

describe("booking accessibility and theme audit", () => {
  it("keeps booking surfaces on tokenized classes and a11y markers", () => {
    const bookingPage = read("src/app/booking/[slug]/page.tsx");
    const calendar = read("src/components/ui/calendar.tsx");
    const datePicker = read("src/components/booking/BookingDatePicker.tsx");

    expect(bookingPage).toContain('aria-live="polite"');
    expect(bookingPage).toContain('aria-live="assertive"');
    expect(calendar).toContain("focus-visible:ring-2");
    expect(datePicker).toContain("modifiersClassNames");

    const forbidden = /(bg-white|text-gray-[0-9]{2,3}|border-gray-[0-9]{2,3})/;
    expect(forbidden.test(bookingPage)).toBe(false);
    expect(forbidden.test(calendar)).toBe(false);
    expect(forbidden.test(datePicker)).toBe(false);
  });

  it("keeps staff/admin surfaces on tokenized classes with focus-visible keyboard support (REDESIGN-8)", () => {
    // Representative sample of staff/admin files fixed in REDESIGN-7 (raw
    // light-palette colors) and REDESIGN-8 (focus-visible keyboard support).
    // Not exhaustive — dashboard-theme-class-audit.test.ts already scans
    // every file under src/app/staff and src/app/admin for the forbidden
    // color patterns; this test additionally locks in the a11y fix.
    const files = [
      "src/app/admin/layout.tsx",
      "src/app/admin/subscriptions/page.tsx",
      "src/app/admin/organizations/page.tsx",
      "src/app/admin/organizations/[id]/page.tsx",
      "src/app/staff/appointments/page.tsx",
      "src/app/staff/appointments/[id]/page.tsx",
      "src/app/staff/availability/page.tsx",
      "src/app/staff/dashboard/page.tsx",
      "src/app/staff/accept-invite/page.tsx",
      "src/components/staff/staff-invite-token-form.tsx",
    ];

    const forbidden = /(bg-white|text-gray-[0-9]{2,3}|border-gray-[0-9]{2,3})/;

    for (const relPath of files) {
      const content = read(relPath);
      expect(forbidden.test(content), `${relPath} should not contain forbidden light-mode classes`).toBe(false);
      expect(content, `${relPath} should have at least one focus-visible ring for keyboard navigation`).toContain(
        "focus-visible:ring"
      );
    }
  });
});
