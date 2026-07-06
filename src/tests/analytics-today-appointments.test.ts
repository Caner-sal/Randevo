import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    appointment: { findMany: vi.fn(), count: vi.fn() },
  },
}));

import { db } from "@/lib/db";
import { getTodayAppointments } from "@/services/analytics.service";

const mockFindMany = vi.mocked(db.appointment.findMany);

describe("getTodayAppointments", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps nested service/staff/customer relations into a flat summary", async () => {
    const startTime = new Date("2026-07-06T09:00:00.000Z");
    const rawAppointment = {
      id: "apt1",
      startTime,
      status: "CONFIRMED",
      service: { name: "Haircut" },
      staff: { name: "Ahmet" },
      customer: { fullName: "Jane Doe" },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockFindMany.mockResolvedValueOnce([rawAppointment] as any);

    const result = await getTodayAppointments("org1");

    expect(result).toEqual([
      {
        id: "apt1",
        startTime,
        status: "CONFIRMED",
        serviceName: "Haircut",
        staffName: "Ahmet",
        customerName: "Jane Doe",
      },
    ]);
  });

  it("scopes the query to organizationId and today's date range, ordered by startTime", async () => {
    mockFindMany.mockResolvedValueOnce([]);

    await getTodayAppointments("org42");

    const callArgs = mockFindMany.mock.calls[0]?.[0] as {
      where?: { organizationId?: string; startTime?: { gte: Date; lte: Date } };
      orderBy?: { startTime: string };
      take?: number;
    };
    expect(callArgs?.where?.organizationId).toBe("org42");
    expect(callArgs?.where?.startTime?.gte).toBeInstanceOf(Date);
    expect(callArgs?.where?.startTime?.lte).toBeInstanceOf(Date);
    expect(callArgs?.orderBy).toEqual({ startTime: "asc" });
    expect(callArgs?.take).toBe(8);
  });

  it("returns an empty array when there are no appointments today", async () => {
    mockFindMany.mockResolvedValueOnce([]);
    const result = await getTodayAppointments("org1");
    expect(result).toEqual([]);
  });
});
