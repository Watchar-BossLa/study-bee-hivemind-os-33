
import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowImages?: boolean;
  allowLinks?: boolean;
  allowBasicFormatting?: boolean;
}

export class HTMLSanitizer {
  private static getConfig(options: SanitizeOptions = {}): DOMPurify.Config {
    const {
      allowImages = false,
      allowLinks = false,
      allowBasicFormatting = true
    } = options;

    const config: DOMPurify.Config = {
      ALLOWED_TAGS: ['p', 'br'],
      ALLOWED_ATTR: {},
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input'],
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
    };

    if (allowBasicFormatting) {
      config.ALLOWED_TAGS = [...(config.ALLOWED_TAGS || []), 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li'];
    }

    if (allowImages) {
      config.ALLOWED_TAGS = [...(config.ALLOWED_TAGS || []), 'img'];
      config.ALLOWED_ATTR = { ...config.ALLOWED_ATTR, img: ['src', 'alt', 'width', 'height'] };
    }

    if (allowLinks) {
      config.ALLOWED_TAGS = [...(config.ALLOWED_TAGS || []), 'a'];
      config.ALLOWED_ATTR = { ...config.ALLOWED_ATTR, a: ['href', 'target', 'rel'] };
    }

    return config;
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
