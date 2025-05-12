
import { RecurseSafe, Simplify } from '../types/RecurseSafe';
import { AssertEqual } from '../types/Assert';
import { initiateFusion } from '../utils/fusion/initiateFusion';

describe('Deep Type Instantiation Tests', () => {
  it('should compile without TS2589 errors', () => {
    // This test simply ensures the types compile without errors
    expect(typeof initiateFusion).toBe('function');
  });
  
  it('should correctly handle deep nested types', () => {
    // Define a deeply nested type
    type TestDeep = {
      a: {
        b: {
          c: {
            d: {
              e: {
                f: {
                  g: {
                    h: {
                      i: {
                        j: number;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
    
    // This would cause TS2589 without our solution
    type SafeTestDeep = AssertEqual<Simplify<RecurseSafe<TestDeep, 12>>>;
    
    // Construct a value of this type to verify it works at runtime
    const testValue: SafeTestDeep = {
      a: { b: { c: { d: { e: { f: { g: { h: { i: { j: 42 } } } } } } } } }
    };
    
    expect(testValue.a.b.c.d.e.f.g.h.i.j).toBe(42);
  });
});
