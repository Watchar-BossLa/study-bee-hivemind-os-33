
/**
 * Utility type that takes a number N and returns N-1
 * Used to control recursion depth in complex types
 */
export type MinusOne<N extends number> =
  [...Array<N>]['length'] extends infer L ? L & number : never;
