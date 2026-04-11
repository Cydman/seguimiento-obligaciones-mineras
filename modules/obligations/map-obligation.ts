import type { Obligation } from "@/types/obligations";

type ObligationRow = {
  id: string;
  title_id: string;
  organization_id: string;
  code: string;
  name: string;
  authority: Obligation["authority"];
  status: Obligation["status"];
  priority: Obligation["priority"];
  due_date: string;
  description: string;
  legal_basis: string | null;
  created_at: string;
};

export function mapObligationRow(row: ObligationRow): Obligation {
  return {
    id: row.id,
    titleId: row.title_id,
    organizationId: row.organization_id,
    code: row.code,
    name: row.name,
    authority: row.authority,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    description: row.description,
    legalBasis: row.legal_basis ?? undefined,
    createdAt: row.created_at,
  };
}