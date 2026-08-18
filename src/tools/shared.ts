import type { JsonValue } from '../runner.js'

export type JsonObject = { [key: string]: JsonValue }

export const objectOutputSchema = {
  type: 'object',
  additionalProperties: true,
} as const

export function requireText(value: string, label: string): string {
  if (value.trim().length === 0) {
    throw new TypeError(`${label} must not be empty`)
  }
  return value
}

export function requireObject(value: JsonValue): JsonObject {
  if (value === null || Array.isArray(value) || typeof value !== 'object') {
    throw new TypeError('Kungfu returned JSON with a non-object root')
  }
  return value
}

export function renderObject(value: JsonObject): Array<{ type: 'text'; text: string }> {
  return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
}
