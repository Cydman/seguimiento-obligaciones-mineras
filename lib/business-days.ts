function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toKey(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate()
  )}`;
}

function createUtcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number) {
  const copy = new Date(date.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function moveToNextMonday(date: Date) {
  const day = date.getUTCDay(); // 0 domingo, 1 lunes
  if (day === 1) return date;
  const daysToAdd = day === 0 ? 1 : 8 - day;
  return addDays(date, daysToAdd);
}

function easterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return createUtcDate(year, month, day);
}

function getColombiaHolidayKeys(year: number) {
  const holidays = new Set<string>();

  const add = (date: Date) => holidays.add(toKey(date));

  // Fijos
  add(createUtcDate(year, 1, 1));   // Año Nuevo
  add(createUtcDate(year, 5, 1));   // Día del Trabajo
  add(createUtcDate(year, 7, 20));  // Independencia
  add(createUtcDate(year, 8, 7));   // Batalla de Boyacá
  add(createUtcDate(year, 12, 8));  // Inmaculada Concepción
  add(createUtcDate(year, 12, 25)); // Navidad

  // Ley Emiliani (trasladados al lunes)
  add(moveToNextMonday(createUtcDate(year, 1, 6)));   // Reyes
  add(moveToNextMonday(createUtcDate(year, 3, 19)));  // San José
  add(moveToNextMonday(createUtcDate(year, 6, 29)));  // San Pedro y San Pablo
  add(moveToNextMonday(createUtcDate(year, 8, 15)));  // Asunción
  add(moveToNextMonday(createUtcDate(year, 10, 12))); // Día de la Raza
  add(moveToNextMonday(createUtcDate(year, 11, 1)));  // Todos los Santos
  add(moveToNextMonday(createUtcDate(year, 11, 11))); // Independencia de Cartagena

  const easter = easterSunday(year);

  // Semana Santa
  add(addDays(easter, -3)); // Jueves Santo
  add(addDays(easter, -2)); // Viernes Santo

  // Festivos religiosos movidos al lunes
  add(moveToNextMonday(addDays(easter, 39))); // Ascensión
  add(moveToNextMonday(addDays(easter, 60))); // Corpus Christi
  add(moveToNextMonday(addDays(easter, 68))); // Sagrado Corazón

  return holidays;
}

function parseDateOnly(value: string | Date) {
  if (value instanceof Date) {
    return createUtcDate(
      value.getUTCFullYear(),
      value.getUTCMonth() + 1,
      value.getUTCDate()
    );
  }

  const text = String(value).trim();

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return createUtcDate(Number(match[1]), Number(match[2]), Number(match[3]));
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${value}`);
  }

  return createUtcDate(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );
}

export function isColombiaBusinessDay(dateInput: string | Date) {
  const date = parseDateOnly(dateInput);
  const day = date.getUTCDay();
  if (day === 0 || day === 6) return false;

  const holidays = getColombiaHolidayKeys(date.getUTCFullYear());
  return !holidays.has(toKey(date));
}

export function getColombiaBusinessDaysRemaining(
  dueDateInput: string | Date,
  fromDateInput: string | Date = new Date()
) {
  const dueDate = parseDateOnly(dueDateInput);
  const fromDate = parseDateOnly(fromDateInput);

  if (toKey(dueDate) === toKey(fromDate)) {
    return 0;
  }

  const forward = dueDate.getTime() >= fromDate.getTime();
  let cursor = forward ? addDays(fromDate, 1) : addDays(dueDate, 1);
  const end = forward ? dueDate : fromDate;

  let count = 0;
  while (cursor.getTime() <= end.getTime()) {
    if (isColombiaBusinessDay(cursor)) {
      count += 1;
    }
    cursor = addDays(cursor, 1);
  }

  return forward ? count : -count;
}

export function formatBusinessDaysRemaining(days: number) {
  if (days === 0) return "Hoy";
  return String(days);
}

export function getBusinessDaysBadgeClass(days: number) {
  if (days < 0) return "border-red-500/30 bg-red-500/15 text-red-300";
  if (days === 0) return "border-red-500/30 bg-red-500/15 text-red-300";
  if (days <= 3) return "border-amber-500/30 bg-amber-500/15 text-amber-300";
  if (days <= 7) return "border-sky-500/30 bg-sky-500/15 text-sky-300";
  return "border-emerald-500/30 bg-emerald-500/15 text-emerald-300";
}