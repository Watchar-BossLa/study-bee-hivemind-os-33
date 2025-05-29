
interface AccessibilityIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  element?: HTMLElement;
  rule: string;
}

export class AccessibilityChecker {
  private static issues: AccessibilityIssue[] = [];

  static runBasicChecks(): AccessibilityIssue[] {
    this.issues = [];
    
    this.checkImages();
    this.checkButtons();
    this.checkForms();
    this.checkHeadings();
    this.checkLinks();
    this.checkColorContrast();
    
    return this.issues;
  }

  private static checkImages(): void {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        this.addIssue({
          severity: 'error',
          message: 'Image missing alt text',
          element: img,
          rule: 'WCAG 1.1.1'
        });
      }
    });
  }

  private static checkButtons(): void {
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((button) => {
      const hasText = button.textContent?.trim();
      const hasAriaLabel = button.getAttribute('aria-label');
      const hasAriaLabelledBy = button.getAttribute('aria-labelledby');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        this.addIssue({
          severity: 'error',
          message: 'Button missing accessible name',
          element: button as HTMLElement,
          rule: 'WCAG 4.1.2'
        });
      }
    });
  }

  private static checkForms(): void {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`);
      const hasAriaLabel = input.getAttribute('aria-label');
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        this.addIssue({
          severity: 'error',
          message: 'Form control missing label',
          element: input as HTMLElement,
          rule: 'WCAG 3.3.2'
        });
      }
    });
  }

  private static checkHeadings(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    
    headings.forEach((heading) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      
      if (currentLevel > previousLevel + 1) {
        this.addIssue({
          severity: 'warning',
          message: 'Heading levels should not be skipped',
          element: heading as HTMLElement,
          rule: 'WCAG 1.3.1'
        });
      }
      
      previousLevel = currentLevel;
    });
  }

  private static checkLinks(): void {
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
      const text = link.textContent?.trim();
      
      if (!text || text.toLowerCase() === 'click here' || text.toLowerCase() === 'read more') {
        this.addIssue({
          severity: 'warning',
          message: 'Link text should be descriptive',
          element: link,
          rule: 'WCAG 2.4.4'
        });
      }
    });
  }

  private static checkColorContrast(): void {
    // Basic color contrast check (simplified)
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    
    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - in production, use a proper contrast ratio calculator
      if (color === backgroundColor) {
        this.addIssue({
          severity: 'error',
          message: 'Insufficient color contrast',
          element: element as HTMLElement,
          rule: 'WCAG 1.4.3'
        });
      }
    });
  }

  private static addIssue(issue: AccessibilityIssue): void {
    this.issues.push(issue);
  }

  static logIssues(): void {
    const issues = this.runBasicChecks();
    
    if (issues.length === 0) {
      console.log('✅ No accessibility issues found');
      return;
    }
    
    console.group('🔍 Accessibility Issues Found:');
    issues.forEach((issue, index) => {
      const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${index + 1}. ${issue.message} (${issue.rule})`);
      if (issue.element) {
        console.log('   Element:', issue.element);
      }
    });
    console.groupEnd();
  }
}
