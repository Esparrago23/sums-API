export function assertRequired(value: unknown, field: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${field} es requerido`);
  }
}

export function assertAllowedValue<T extends string>(
  value: unknown,
  field: string,
  allowedValues: readonly T[]
): void {
  if (value === undefined || value === null) return;
  if (!allowedValues.includes(value as T)) {
    throw new Error(`${field} debe ser uno de: ${allowedValues.join(', ')}`);
  }
}

export function assertIntegerInRange(
  value: unknown,
  field: string,
  min: number,
  max: number
): void {
  if (!Number.isInteger(value) || (value as number) < min || (value as number) > max) {
    throw new Error(`${field} debe ser un entero entre ${min} y ${max}`);
  }
}

export function assertNonNegativeNumber(value: unknown, field: string): void {
  if (value === undefined || value === null) return;
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    throw new Error(`${field} no debe ser negativo`);
  }
}

export function assertStringLength(value: unknown, field: string, length: number): void {
  if (value === undefined || value === null) return;
  if (typeof value !== 'string' || value.length !== length) {
    throw new Error(`${field} debe ser un string de ${length} caracteres`);
  }
}

export function rejectFields(data: Record<string, unknown>, fields: string[]): void {
  const found = fields.filter((field) => data[field] !== undefined);
  if (found.length > 0) {
    throw new Error(`Campos no permitidos en el modelo corregido: ${found.join(', ')}`);
  }
}

export function normalizeDateField(data: Record<string, unknown>, field: string): void {
  const value = data[field];
  if (typeof value === 'string') {
    data[field] = new Date(value);
  }
}

export function assertTamizajeDate(
  data: Record<string, unknown>,
  tamizajeField: string,
  dateField: string
): void {
  if (data[tamizajeField] === true && !data[dateField]) {
    throw new Error(`${dateField} es requerido cuando ${tamizajeField} es true`);
  }
}

export function parsePositiveId(rawValue: string, field = 'id'): number {
  const id = Number(rawValue);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`${field} debe ser un entero positivo`);
  }
  return id;
}
