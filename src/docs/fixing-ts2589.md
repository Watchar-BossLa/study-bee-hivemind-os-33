
# Fixing TS2589: Type instantiation is excessively deep

This document outlines the approach used to fix `TS2589` errors throughout the codebase.

## Problem

TypeScript has a limit on how deeply it will instantiate (analyze) nested types. When this limit is exceeded, you'll get an error like:

```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

This commonly happens with:
- Deeply nested object types
- Complex conditional types with multiple layers
- Recursive types without proper termination conditions

## Solution

We've implemented a set of utility types to safely limit the recursion depth:

1. `RecurseSafe<T, D>` - Limits recursion to depth D (default: 12)
2. `Simplify<T>` - Collapses and simplifies complex types
3. `AssertEqual<T, U>` - Maintains type checking while preserving intellisense

## How to Apply

When encountering a TS2589 error:

1. Add imports for the helper types:
```typescript
import { RecurseSafe, Simplify } from '../types/RecurseSafe';
import { AssertEqual } from '../types/Assert';
```

2. Wrap the problematic type:
```typescript
// Before (causes TS2589)
type DeepType = { /* deeply nested structure */ };

// After (fixed)
type SafeDeepType = AssertEqual<
  Simplify<
    RecurseSafe<DeepType, 12>
  >
>;
```

3. Use the safe type in your code.

## Best Practices

- Keep depth parameter (`D`) reasonably small (10-15 is usually sufficient)
- Apply these helpers at type definition sites, not usage sites
- Consider refactoring overly complex types into simpler structures
- Add test cases to validate that deep types work correctly

## Example

```typescript
// Original (causes TS2589)
type DeepConfig = {
  options: {
    advanced: {
      settings: {
        // many more levels...
      }
    }
  }
};

// Fixed
type SafeConfig = AssertEqual<Simplify<RecurseSafe<DeepConfig, 12>>>;

function processConfig(config: SafeConfig) {
  // Implementation
}
```
