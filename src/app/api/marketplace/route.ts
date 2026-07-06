import { db } from "@/lib/db";
import { getMarketplaceCategoryAliases } from "@/data/marketplace-categories";
import { NextResponse } from "next/server";

// Public marketplace listing - no auth required
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const locality = searchParams.get("locality");
    const province = searchParams.get("province");
    const district = searchParams.get("district");
    const country = searchParams.get("country");
    const countryCode = (country ?? searchParams.get("countryCode"))?.toUpperCase();
    const q = searchParams.get("q");
    const trSelected = countryCode === "TR";

    let organizationIdFilter: string[] | undefined;
    if (countryCode || locality) {
      const matches = await db.normalizedAddress.findMany({
        where: {
          ownerType: "ORGANIZATION",
          ...(countryCode ? { countryCode } : {}),
          ...(!trSelected && locality
            ? {
                OR: [
                  { locality: { contains: locality } },
                  { adminLevel2: { contains: locality } },
                  { formattedAddress: { contains: locality } },
                ],
              }
            : {}),
        },
        select: { ownerId: true },
        take: 200,
      });

      organizationIdFilter = [...new Set(matches.map((item) => item.ownerId as string))];
    }

    const andFilters: Array<Record<string, unknown>> = [];

    if (q) {
      andFilters.push({
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { contains: q } },
        ],
      });
    }

    if (category) {
      const aliases = getMarketplaceCategoryAliases(category);
      andFilters.push({
        OR: aliases.map((alias) => ({ category: { contains: alias } })),
      });
    }

    if (trSelected && province) {
      andFilters.push({ province });
    }

    if (trSelected && district) {
      andFilters.push({ district });
    }

    if (!trSelected && locality) {
      andFilters.push({
        OR: [
          { city: { contains: locality } },
          { locality: { contains: locality } },
          { formattedAddress: { contains: locality } },
        ],
      });
    }

    if (!trSelected && city) {
      andFilters.push({ city: { contains: city } });
    }

    const orgs = await db.organization.findMany({
      where: {
        marketplaceEnabled: true,
        bookingEnabled: true,
        suspended: false,
        ...(countryCode ? { countryCode } : {}),
        ...(organizationIdFilter && organizationIdFilter.length > 0 ? { id: { in: organizationIdFilter } } : {}),
        ...(andFilters.length > 0 ? { AND: andFilters } : {}),
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        city: true,
        province: true,
        district: true,
        coverImageUrl: true,
        logoUrl: true,
        phone: true,
        _count: { select: { services: { where: { isActive: true } } } },
      },
      orderBy: { name: "asc" },
      take: 50,
    });

    return NextResponse.json({ data: orgs });
  } catch (err) {
    console.error("[marketplace/search]", err);
    return NextResponse.json(
      { ok: false, code: "MARKETPLACE_SEARCH_FAILED" },
      { status: 500 },
    );
  }
}

