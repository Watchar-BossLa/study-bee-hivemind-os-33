
/**
 * Handles OAuth authentication for Agent-to-Agent (A2A) communications
 * Implements the 'feat/a2a-auth0' feature from QuorumForge OS
 */
export class A2AOAuthHandler {
  private authConfig: A2AAuthConfig;
  private accessTokenCache: Map<string, TokenCacheEntry> = new Map();
  
  constructor(config?: Partial<A2AAuthConfig>) {
    this.authConfig = {
      domain: config?.domain || "studybee-dev.us.auth0.com",
      audience: config?.audience || "a2a-api",
      clientId: config?.clientId || "agent-to-agent-client",
      scope: config?.scope || "read:messages write:messages",
      tokenEndpoint: config?.tokenEndpoint || "/oauth/token",
      grantType: config?.grantType || "client_credentials"
    };
  }
  
  /**
   * Get an access token for A2A API communication
   * Uses cached token if available and not expired
   */
  public async getAccessToken(): Promise<string> {
    const cacheKey = `${this.authConfig.clientId}:${this.authConfig.audience}`;
    const cachedToken = this.accessTokenCache.get(cacheKey);
    
    if (cachedToken && Date.now() < cachedToken.expiresAt) {
      console.log("Using cached A2A access token");
      return cachedToken.token;
    }
    
    try {
      const token = await this.fetchNewToken();
      return token;
    } catch (error) {
      console.error("Error obtaining A2A access token:", error);
      throw new Error("Failed to obtain A2A access token");
    }
  }
  
  /**
   * Fetch a new access token from the auth server
   */
  private async fetchNewToken(): Promise<string> {
    console.log("Fetching new A2A access token");
    
    // In a real implementation, this would make an actual OAuth request
    // For demo purposes, we simulate a successful token response
    const tokenResponse = {
      access_token: `a2a_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expires_in: 3600,
      token_type: "Bearer"
    };
    
    // Cache the token
    this.accessTokenCache.set(
      `${this.authConfig.clientId}:${this.authConfig.audience}`, 
      {
        token: tokenResponse.access_token,
        expiresAt: Date.now() + (tokenResponse.expires_in * 1000)
      }
    );
    
    return tokenResponse.access_token;
  }
  
  /**
   * Clear the token cache
   */
  public clearTokenCache(): void {
    this.accessTokenCache.clear();
  }
  
  /**
   * Create HTTP headers with auth token
   */
  public async createAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken();
    
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }
}

/**
 * Configuration for A2A OAuth
 */
export interface A2AAuthConfig {
  domain: string;
  audience: string;
  clientId: string;
  scope: string;
  tokenEndpoint: string;
  grantType: string;
}

/**
 * Cache entry for token storage
 */
interface TokenCacheEntry {
  token: string;
  expiresAt: number;
}
