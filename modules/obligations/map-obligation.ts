import type { Obligation } from "@/types/obligations";

export function mapObligationRow(row: any): Obligation {
  return {
    id: row.id,
    organizationId: row.organization_id,
    titleId: row.title_id,
    code: row.code,
    name: row.name,
    authority: row.authority,
    status: row.status,
    priority: row.priority,
    category: row.category,
    dueDate: row.due_date,
    description: row.description,
    legalBasis: row.legal_basis ?? null,
    assignedProfileId: row.assigned_profile_id ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}