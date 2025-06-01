
interface SanitizationOptions {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripScripts?: boolean;
}

export class HTMLSanitizer {
  private static readonly DEFAULT_ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre', 'a', 'img'
  ];

  private static readonly DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'width', 'height'],
    'blockquote': ['cite'],
    '*': ['class', 'id']
  };

  static validateAndSanitize(
    html: string, 
    options: SanitizationOptions = {}
  ): string {
    const {
      allowedTags = this.DEFAULT_ALLOWED_TAGS,
      allowedAttributes = this.DEFAULT_ALLOWED_ATTRIBUTES,
      stripScripts = true
    } = options;

    // Basic XSS prevention
    let sanitized = html;

    // Remove script tags and their content
    if (stripScripts) {
      sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }

    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
    sanitized = sanitized.replace(/\son\w+\s*=\s*'[^']*'/gi, '');

    // Remove style attributes that could contain CSS expressions
    sanitized = sanitized.replace(/\sstyle\s*=\s*"[^"]*"/gi, '');

    // For production use, integrate with DOMPurify library
    if (typeof window !== 'undefined' && (window as any).DOMPurify) {
      const DOMPurify = (window as any).DOMPurify;
      return DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: allowedTags,
        ALLOWED_ATTR: Object.values(allowedAttributes).flat()
      });
    }

    return sanitized;
  }

  static escapeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}
