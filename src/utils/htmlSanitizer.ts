
import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowImages?: boolean;
  allowLinks?: boolean;
  allowBasicFormatting?: boolean;
}

export class HTMLSanitizer {
  private static getConfig(options: SanitizeOptions = {}) {
    const {
      allowImages = false,
      allowLinks = false,
      allowBasicFormatting = true
    } = options;

    let allowedTags = ['p', 'br'];
    let allowedAttributes: { [key: string]: string[] } = {};

    if (allowBasicFormatting) {
      allowedTags.push('strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li');
    }

    if (allowImages) {
      allowedTags.push('img');
      allowedAttributes.img = ['src', 'alt', 'width', 'height'];
    }

    if (allowLinks) {
      allowedTags.push('a');
      allowedAttributes.a = ['href', 'target', 'rel'];
    }

    return {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
    };
  }

  static sanitize(html: string, options?: SanitizeOptions): string {
    if (!html || typeof html !== 'string') {
      return '';
    }

    const config = this.getConfig(options);
    return DOMPurify.sanitize(html, config);
  }

  static sanitizeForDisplay(html: string): string {
    return this.sanitize(html, {
      allowBasicFormatting: true,
      allowImages: true,
      allowLinks: true
    });
  }

  static sanitizeUserInput(input: string): string {
    return this.sanitize(input, {
      allowBasicFormatting: false,
      allowImages: false,
      allowLinks: false
    });
  }

  static validateAndSanitize(input: unknown): string {
    if (typeof input !== 'string') {
      console.warn('HTMLSanitizer: Non-string input detected and rejected');
      return '';
    }

    // Check for obvious malicious patterns
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /data:text\/html/i,
      /onload=/i,
      /onerror=/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(input)) {
        console.error('HTMLSanitizer: Potentially malicious content detected and blocked');
        return '';
      }
    }

    return this.sanitizeForDisplay(input);
  }
}
