export interface MiningTitleRecord {
  id: string;
  code: string;
  name: string;
  mineral: string;
  municipality: string;
  department: string;
  organization_id: string;

  holder_name: string | null;
  holder_identification: string | null;
  holder_address: string | null;
  holder_phone: string | null;
  holder_email: string | null;

  subcontractor_name: string | null;
  subcontractor_identification: string | null;
  subcontractor_address: string | null;
  subcontractor_phone: string | null;
  subcontractor_email: string | null;

  mine_name: string | null;
  village: string | null;
  title_modality: string | null;
  granted_area: string | null;
  rmn_registration_date: string | null;
  contract_stage: string | null;
  subcontract_rmn_registration_date: string | null;
  annuality: string | null;
  is_active: boolean;
}