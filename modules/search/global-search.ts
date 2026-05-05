import { createAdminClient } from "@/lib/supabase/admin";
import { mapObligationRow } from "@/modules/obligations/map-obligation";
import type { Profile } from "@/types/auth";

interface SearchResultOrganization {
  id: string;
  name: string;
  document_number: string;
  is_active: boolean;
}

interface SearchResultTitle {
  id: string;
  code: string;
  name: string;
  mine_name: string | null;
  organization_id: string;
  is_active: boolean;
}

interface SearchResultProfile {
  id: string;
  full_name: string | null;
  email: string;
  role: string;
  is_active: boolean;
  organization_id: string | null;
}

export async function globalSearch(profile: Profile, rawQuery: string) {
  const q = rawQuery.trim();

  if (q.length < 2) {
    return {
      query: q,
      obligations: [],
      titles: [] as SearchResultTitle[],
      organizations: [] as SearchResultOrganization[],
      users: [] as SearchResultProfile[],
    };
  }

  const adminClient = createAdminClient();

  let obligationsQuery = adminClient
    .from("obligations")
    .select("*")
    .eq("is_active", true)
    .or(`code.ilike.%${q}%,name.ilike.%${q}%,description.ilike.%${q}%`)
    .order("due_date", { ascending: true })
    .limit(12);

  if (profile.role === "client" && profile.organization_id) {
    obligationsQuery = obligationsQuery.eq("organization_id", profile.organization_id);
  }

  if (profile.role === "specialist") {
    obligationsQuery = obligationsQuery.or(
      `category.eq.${profile.specialty ?? "___"},assigned_profile_id.eq.${profile.id}`
    );
  }

  const { data: obligationRows, error: obligationsError } = await obligationsQuery;

  if (obligationsError) {
    throw new Error(`Error consultando obligaciones: ${obligationsError.message}`);
  }

  if (profile.role === "admin") {
    const [
      { data: titles, error: titlesError },
      { data: organizations, error: orgError },
      { data: users, error: usersError },
    ] = await Promise.all([
      adminClient
        .from("mining_titles")
        .select("id, code, name, mine_name, organization_id, is_active")
        .or(`code.ilike.%${q}%,name.ilike.%${q}%,mine_name.ilike.%${q}%`)
        .order("code")
        .limit(10),

      adminClient
        .from("organizations")
        .select("id, name, document_number, is_active")
        .or(`name.ilike.%${q}%,document_number.ilike.%${q}%`)
        .order("name")
        .limit(10),

      adminClient
        .from("profiles")
        .select("id, full_name, email, role, is_active, organization_id")
        .or(`full_name.ilike.%${q}%,email.ilike.%${q}%`)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (titlesError) {
      throw new Error(`Error consultando títulos: ${titlesError.message}`);
    }

    if (orgError) {
      throw new Error(`Error consultando organizaciones: ${orgError.message}`);
    }

    if (usersError) {
      throw new Error(`Error consultando usuarios: ${usersError.message}`);
    }

    return {
      query: q,
      obligations: (obligationRows ?? []).map(mapObligationRow),
      titles: titles ?? [],
      organizations: organizations ?? [],
      users: users ?? [],
    };
  }

  if (profile.role === "client" && profile.organization_id) {
    const { data: titles, error: titlesError } = await adminClient
      .from("mining_titles")
      .select("id, code, name, mine_name, organization_id, is_active")
      .eq("organization_id", profile.organization_id)
      .eq("is_active", true)
      .or(`code.ilike.%${q}%,name.ilike.%${q}%,mine_name.ilike.%${q}%`)
      .order("code")
      .limit(10);

    if (titlesError) {
      throw new Error(`Error consultando títulos: ${titlesError.message}`);
    }

    return {
      query: q,
      obligations: (obligationRows ?? []).map(mapObligationRow),
      titles: titles ?? [],
      organizations: [],
      users: [],
    };
  }

  return {
    query: q,
    obligations: (obligationRows ?? []).map(mapObligationRow),
    titles: [],
    organizations: [],
    users: [],
  };
}