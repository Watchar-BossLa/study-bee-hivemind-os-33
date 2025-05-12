
import { RecurseSafe, Simplify } from '../../types/RecurseSafe';
import { AssertEqual } from '../../types/Assert';

// Example of a deep type that would cause TS2589
type DeepFusionInput = {
  source: {
    data: {
      nested: {
        elements: {
          config: {
            options: {
              advanced: {
                settings: {
                  parameters: {
                    type: string;
                    values: string[];
                  }[];
                };
              };
            };
          };
        }[];
      };
    };
  };
  target: {
    destination: string;
    mapping: Record<string, unknown>;
  };
};

// Before: This would cause TS2589
// type FusionPayload = DeepFusionInput;

// After: Fixed with RecurseSafe
type FusionPayload = AssertEqual<
  Simplify<
    RecurseSafe<DeepFusionInput, 12>
  >
>;

export function initiateFusion(payload: FusionPayload) {
  // Function implementation
  return {
    success: true,
    result: 'Fusion completed'
  };
}
