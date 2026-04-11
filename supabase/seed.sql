insert into public.organizations (
  id,
  name,
  document_number,
  subscription_plan,
  is_active
)
values (
  '11111111-1111-1111-1111-111111111111',
  'Mina Don Camilo S.A.S.',
  '900123456-7',
  'profesional',
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
  '22222222-2222-2222-2222-222222222222',
  'PDBA-00001',
  'Polígono No. 10 Don Camilo',
  'Carbón',
  'Sativanorte',
  'Boyacá',
  '11111111-1111-1111-1111-111111111111'
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
  '33333333-3333-3333-3333-333333333331',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'OBL-ANM-001',
  'Presentación de informe técnico semestral',
  'ANM',
  'pendiente',
  'alta',
  '2026-05-20',
  'Cargar y radicar el informe técnico semestral del título.',
  'Contrato de concesión / requerimientos ANM'
),
(
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'OBL-ANLA-002',
  'Actualización de soporte ambiental',
  'ANLA',
  'en_proceso',
  'media',
  '2026-05-30',
  'Actualizar documentación y soportes del componente ambiental.',
  'Instrumento ambiental aplicable'
),
(
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'OBL-CAR-003',
  'Entrega de reporte de vertimientos',
  'CAR',
  'vencida',
  'alta',
  '2026-04-05',
  'Remitir reporte de vertimientos ante autoridad competente.',
  'Normativa ambiental regional'
),
(
  '33333333-3333-3333-3333-333333333334',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'OBL-MUN-004',
  'Renovación de requisito municipal',
  'MUNICIPIO',
  'cumplida',
  'baja',
  '2026-03-28',
  'Actualizar requisito documental exigido por el municipio.',
  'Reglamentación municipal aplicable'
);