export interface ObligationDocument {
  id: string;
  obligation_id: string;
  organization_id: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}