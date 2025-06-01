
import { ENVIRONMENT } from '@/config/environment';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export class FeatureTester {
  static async testFeatureFlags(): Promise<TestResult> {
    const enabledFeatures = Object.entries(ENVIRONMENT.FEATURES)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);
    
    return {
      name: 'Feature Flags',
      status: 'pass',
      message: `${enabledFeatures.length} features enabled`,
      details: enabledFeatures
    };
  }
}
