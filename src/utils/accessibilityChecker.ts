
interface AccessibilityIssue {
  element: HTMLElement;
  issue: string;
  severity: 'low' | 'medium' | 'high';
}

export class AccessibilityChecker {
  static runBasicChecks(): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];

    // Check for images without alt text
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      issues.push({
        element: img as HTMLElement,
        issue: 'Image missing alt attribute',
        severity: 'high'
      });
    });

    // Check for buttons/links without accessible text
    const buttons = document.querySelectorAll('button:empty, a:empty');
    buttons.forEach(btn => {
      if (!btn.getAttribute('aria-label') && !btn.getAttribute('title')) {
        issues.push({
          element: btn as HTMLElement,
          issue: 'Interactive element lacks accessible text',
          severity: 'high'
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    inputs.forEach(input => {
      const id = input.getAttribute('id');
      if (!id || !document.querySelector(`label[for="${id}"]`)) {
        issues.push({
          element: input as HTMLElement,
          issue: 'Form input lacks proper label',
          severity: 'medium'
        });
      }
    });

    return issues;
  }

  static logIssues(): void {
    const issues = this.runBasicChecks();
    
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found');
      return;
    }

    console.group('♿ Accessibility Issues Found');
    issues.forEach(issue => {
      const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      console.warn(`${icon} ${issue.issue}`, issue.element);
    });
    console.groupEnd();
  }
}
