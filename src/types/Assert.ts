
/**
 * Utility type that asserts T is assignable to U
 * Used to verify type compatibility while maintaining IntelliSense
 */
export type AssertEqual<T, U extends T = T> = U;
