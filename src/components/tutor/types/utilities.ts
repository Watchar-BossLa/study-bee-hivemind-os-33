
/**
 * Makes all properties in T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Ensures all properties in T are non-nullable
 */
export type NonNullableProps<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

/**
 * Creates a type that requires at least one property from T
 */
export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

/**
 * Creates a type with exactly the keys specified in K from type T
 */
export type PickExact<T, K extends keyof T> = Pick<T, K> & {
  [P in Exclude<keyof T, K>]?: never;
};

/**
 * Type guard for non-nullable values
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

/**
 * Type guard for checking if value is of a certain type
 */
export function isOfType<T>(
  value: unknown,
  propertyToCheck: keyof T
): value is T {
  return (
    typeof value === 'object' &&
    value !== null &&
    propertyToCheck in value
  );
}

/**
 * Safe access to deeply nested properties with type safety
 */
export function safeAccess<T, K1 extends keyof T>(
  obj: T | null | undefined,
  key1: K1
): T[K1] | undefined;

export function safeAccess<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1]
>(
  obj: T | null | undefined,
  key1: K1,
  key2: K2
): T[K1][K2] | undefined;

export function safeAccess<
  T,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2]
>(
  obj: T | null | undefined,
  key1: K1,
  key2: K2,
  key3: K3
): T[K1][K2][K3] | undefined;

export function safeAccess(
  obj: unknown,
  ...keys: string[]
): unknown {
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}
