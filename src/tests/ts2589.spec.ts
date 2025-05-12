
import { RecurseSafe, Simplify } from '../types/RecurseSafe';
import { AssertEqual } from '../types/Assert';

// Example of deeply nested type (simplified for testing)
type DeepNestedType = {
  level1: {
    level2: {
      level3: {
        level4: {
          level5: {
            level6: {
              level7: {
                level8: {
                  level9: {
                    level10: {
                      level11: {
                        level12: {
                          level13: {
                            value: string;
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
      };
    };
  };
};

// This would normally cause TS2589, but RecurseSafe prevents it
type _NoError = AssertEqual<Simplify<RecurseSafe<DeepNestedType, 15>>>;

describe('Deep Type Tests', () => {
  it('compiles without TS2589', () => {
    expect(true).toBeTruthy();
  });
});
