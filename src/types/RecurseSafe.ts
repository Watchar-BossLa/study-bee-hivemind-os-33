
import { MinusOne } from './math/MinusOne';

/**
 * Safely limits recursion depth for complex types to prevent TS2589 errors
 * @param T - The type to make recursion-safe
 * @param D - Maximum recursion depth (default: 12)
 */
export type RecurseSafe<T, D extends number = 12> =
  D extends 0
    ? T
    : T extends object
        ? { [K in keyof T]: RecurseSafe<T[K], MinusOne<D>> }
        : T;

/**
 * Simplifies complex types by collapsing nested structures
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {};
