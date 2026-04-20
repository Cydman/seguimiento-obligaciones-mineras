insert into public.organizations (
  id,
  name,
  document_number,
  subscription_plan,
  is_active
)
values (
  '44444444-4444-4444-4444-444444444444',
  'Minerales La Esperanza S.A.S.',
  '901234567-8',
  'basico',
  true
);

insert into public.mining_titles (
  id,
  code,
  name,
  mineral,
  municipality,
  department,
  organization_id
)
values (
  '55555555-5555-5555-5555-555555555555',
  'TIT-002',
  'Contrato La Esperanza',
  'Barita',
  'Paipa',
  'Boyacá',
  '44444444-4444-4444-4444-444444444444'
);

insert into public.obligations (
  id,
  organization_id,
  title_id,
  code,
  name,
  authority,
  status,
  priority,
  due_date,
  description,
  legal_basis
)
values
(
  '66666666-6666-6666-6666-666666666661',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'OBL-ESP-001',
  'Presentación de reporte trimestral',
  'ANM',
  'pendiente',
  'alta',
  '2026-06-15',
  'Presentar reporte trimestral del título minero.',
  'Obligación contractual y requerimiento de autoridad'
),
(
  '66666666-6666-6666-6666-666666666662',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'OBL-ESP-002',
  'Actualización de soporte técnico',
  'CAR',
  'en_proceso',
  'media',
  '2026-06-25',
  'Actualizar soporte técnico y documental del proyecto.',
  'Normativa técnica y ambiental aplicable'
),
(
  '66666666-6666-6666-6666-666666666663',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  'OBL-ESP-003',
  'Entrega de informe municipal',
  'MUNICIPIO',
  'cumplida',
  'baja',
  '2026-04-01',
  'Entrega de informe de seguimiento municipal.',
  'Reglamento municipal'
);