import type { Property, PropertyFilters, SessionPayload } from "@/types/property";
import type { PropertyInput } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const SELECT_COLUMNS =
  "id,nama_property,group,lebar,panjang,hadap,tipe,tingkat,price,carport,status,siap,maps_link,kawasan,unit,created_at,updated_at,deleted_at,created_by";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyPropertyFilters(query: any, filters: PropertyFilters) {
  let scopedQuery = query.select(SELECT_COLUMNS, { count: "exact" }).is("deleted_at", null);

  if (filters.search) {
    const escaped = filters.search.replace(/%/g, "");
    scopedQuery = scopedQuery.or(`nama_property.ilike.%${escaped}%,group.ilike.%${escaped}%`);
  }

  if (filters.kawasan?.length) scopedQuery = scopedQuery.overlaps("kawasan", filters.kawasan);
  if (filters.hadap?.length) scopedQuery = scopedQuery.overlaps("hadap", filters.hadap);
  if (filters.tipe && filters.tipe !== "all") scopedQuery = scopedQuery.eq("tipe", filters.tipe);
  if (filters.status && filters.status !== "all") scopedQuery = scopedQuery.eq("status", filters.status);
  if (filters.siap?.length) scopedQuery = scopedQuery.in("siap", filters.siap);
  if (filters.carport && filters.carport !== "all") scopedQuery = scopedQuery.eq("carport", filters.carport === "yes");
  if (typeof filters.lebarMin === "number") scopedQuery = scopedQuery.gte("lebar", filters.lebarMin);
  if (typeof filters.hargaMax === "number") scopedQuery = scopedQuery.lte("price", filters.hargaMax);

  const sortBy = filters.sortBy ?? "created_at";
  const sortOrder = filters.sortOrder ?? "desc";
  scopedQuery = scopedQuery.order(sortBy, { ascending: sortOrder === "asc" });

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 50;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return scopedQuery.range(from, to);
}

export async function listProperties(filters: PropertyFilters = {}) {
  const supabase = getSupabaseAdmin();
  const baseQuery = supabase.from("properties");
  const query = applyPropertyFilters(baseQuery, filters);
  const { data, error, count } = await query;

  if (error) throw error;
  return {
    data: (data ?? []) as Property[],
    total: count ?? 0,
  };
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as Property | null;
}

export async function createProperty(input: PropertyInput, actor: SessionPayload): Promise<Property> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...input, created_by: actor.sub })
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    property_id: data.id,
    actor_id: actor.sub,
    actor_email: actor.email,
    action: "create",
    changes: data,
  });

  return data as Property;
}

export async function updateProperty(id: string, input: PropertyInput, actor: SessionPayload): Promise<Property> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("properties")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null)
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    property_id: id,
    actor_id: actor.sub,
    actor_email: actor.email,
    action: "update",
    changes: input,
  });

  return data as Property;
}

export async function softDeleteProperty(id: string, actor: SessionPayload) {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("properties")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) throw error;

  await supabase.from("audit_logs").insert({
    property_id: id,
    actor_id: actor.sub,
    actor_email: actor.email,
    action: "delete",
    changes: { deleted_at: new Date().toISOString() },
  });
}

export async function listFeaturedProperties(limit = 6): Promise<Property[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT_COLUMNS)
    .eq("status", "in_stock")
    .is("deleted_at", null)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Property[];
}

