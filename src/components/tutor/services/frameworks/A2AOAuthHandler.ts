
import { v4 as uuidv4 } from '@/lib/uuid';
import { RedisEventBus, redisEventBus } from '../core/RedisEventBus';

/**
 * A2A OAuth Handler - Manages OAuth authentication for agent-to-agent communication
 * Implements the a2a-auth0 feature from QuorumForge OS spec
 */
export class A2AOAuthHandler {
  private clientTokens: Map<string, {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    scope: string[];
  }> = new Map();
  private serviceTokens: Map<string, {
    accessToken: string;
    expiresAt: Date;
    scope: string[];
  }> = new Map();
  private authorizations: Map<string, Set<string>> = new Map(); // fromAgentId -> Set of toAgentIds
  private eventBus: RedisEventBus;
  private authorizationCode: string | null = null;
  private verifier: string | null = null;
  
  constructor(eventBus?: RedisEventBus) {
    this.eventBus = eventBus || redisEventBus;
    
    // Set up OAuth event listeners
    this.setupEventListeners();
    
    console.log('A2A OAuth Handler initialized');
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for token updates
    this.eventBus.subscribe('oauth:token:update', (tokenUpdate: {
      clientId: string;
      accessToken: string;
      expiresAt: string;
      scope: string[];
    }) => {
      this.serviceTokens.set(tokenUpdate.clientId, {
        accessToken: tokenUpdate.accessToken,
        expiresAt: new Date(tokenUpdate.expiresAt),
        scope: tokenUpdate.scope
      });
    });
    
    // Listen for authorization updates
    this.eventBus.subscribe('oauth:authorization:update', (authUpdate: {
      fromAgentId: string;
      toAgentId: string;
      authorized: boolean;
    }) => {
      if (authUpdate.authorized) {
        if (!this.authorizations.has(authUpdate.fromAgentId)) {
          this.authorizations.set(authUpdate.fromAgentId, new Set());
        }
        this.authorizations.get(authUpdate.fromAgentId)!.add(authUpdate.toAgentId);
      } else {
        if (this.authorizations.has(authUpdate.fromAgentId)) {
          this.authorizations.get(authUpdate.fromAgentId)!.delete(authUpdate.toAgentId);
        }
      }
    });
  }
  
  /**
   * Generate a code verifier for PKCE (Proof Key for Code Exchange)
   */
  public generateCodeVerifier(): string {
    // In a real implementation, this would be a cryptographically secure random string
    const verifier = uuidv4() + uuidv4();
    this.verifier = verifier;
    return verifier;
  }
  
  /**
   * Generate a code challenge from the verifier
   */
  public generateCodeChallenge(verifier: string): string {
    // In a real implementation, this would hash the verifier with SHA-256
    // and then base64url encode it
    return `challenge_${verifier.substring(0, 10)}`;
  }
  
  /**
   * Start the OAuth authorization flow
   * Returns the URL to redirect to for authorization
   */
  public startAuthorizationFlow(
    clientId: string,
    redirectUri: string,
    scope: string[] = ['agent.communicate'],
    state?: string
  ): string {
    const verifier = this.generateCodeVerifier();
    const challenge = this.generateCodeChallenge(verifier);
    
    const stateParam = state || uuidv4();
    
    // In a real implementation, this would be a URL to the OAuth authorization endpoint
    const authUrl = `https://auth.example.com/authorize?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope.join(' '))}` +
      `&state=${encodeURIComponent(stateParam)}` +
      `&code_challenge=${encodeURIComponent(challenge)}` +
      `&code_challenge_method=S256`;
      
    return authUrl;
  }
  
  /**
   * Handle the OAuth callback
   * Exchanges the authorization code for tokens
   */
  public async handleCallback(
    code: string,
    state: string,
    expectedState?: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string[];
  }> {
    if (expectedState && state !== expectedState) {
      throw new Error('Invalid state parameter');
    }
    
    if (!this.verifier) {
      throw new Error('No code verifier found');
    }
    
    this.authorizationCode = code;
    
    // In a real implementation, this would exchange the code for tokens
    // using the token endpoint
    const tokens = {
      accessToken: `access_token_${uuidv4()}`,
      refreshToken: `refresh_token_${uuidv4()}`,
      expiresIn: 3600, // 1 hour
      scope: ['agent.communicate']
    };
    
    // Store the tokens
    const clientId = 'default_client';
    this.clientTokens.set(clientId, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      scope: tokens.scope
    });
    
    return tokens;
  }
  
  /**
   * Refresh an access token
   */
  public async refreshToken(
    clientId: string,
    refreshToken: string
  ): Promise<{
    accessToken: string;
    expiresIn: number;
    scope: string[];
  }> {
    const clientTokens = this.clientTokens.get(clientId);
    
    if (!clientTokens) {
      throw new Error(`No tokens found for client ${clientId}`);
    }
    
    if (clientTokens.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    
    // In a real implementation, this would refresh the token using the token endpoint
    const tokens = {
      accessToken: `access_token_${uuidv4()}`,
      expiresIn: 3600, // 1 hour
      scope: clientTokens.scope
    };
    
    // Update the stored tokens
    this.clientTokens.set(clientId, {
      ...clientTokens,
      accessToken: tokens.accessToken,
      expiresAt: new Date(Date.now() + tokens.expiresIn * 1000)
    });
    
    return tokens;
  }
  
  /**
   * Validate an access token
   */
  public validateToken(accessToken: string): {
    valid: boolean;
    clientId?: string;
    scope?: string[];
    error?: string;
  } {
    // Check client tokens
    for (const [clientId, tokens] of this.clientTokens.entries()) {
      if (tokens.accessToken === accessToken) {
        if (tokens.expiresAt < new Date()) {
          return {
            valid: false,
            clientId,
            error: 'Token expired'
          };
        }
        
        return {
          valid: true,
          clientId,
          scope: tokens.scope
        };
      }
    }
    
    // Check service tokens
    for (const [clientId, tokens] of this.serviceTokens.entries()) {
      if (tokens.accessToken === accessToken) {
        if (tokens.expiresAt < new Date()) {
          return {
            valid: false,
            clientId,
            error: 'Token expired'
          };
        }
        
        return {
          valid: true,
          clientId,
          scope: tokens.scope
        };
      }
    }
    
    return {
      valid: false,
      error: 'Invalid token'
    };
  }
  
  /**
   * Validate access from one agent to another
   */
  public async validateAccess(
    fromAgentId: string,
    toAgentId: string
  ): Promise<boolean> {
    // Check if the authorization exists
    if (this.authorizations.has(fromAgentId)) {
      const authorizations = this.authorizations.get(fromAgentId)!;
      if (authorizations.has(toAgentId)) {
        return true;
      }
    }
    
    // If no explicit authorization, check if this is a public agent
    // In a real implementation, this would check if the toAgentId is a public agent
    // that allows access from any agent
    const isPublicAgent = toAgentId.startsWith('public_');
    
    if (isPublicAgent) {
      return true;
    }
    
    throw new Error(`Agent ${fromAgentId} is not authorized to access agent ${toAgentId}`);
  }
  
  /**
   * Authorize access from one agent to another
   */
  public async authorizeAccess(
    fromAgentId: string,
    toAgentId: string
  ): Promise<void> {
    if (!this.authorizations.has(fromAgentId)) {
      this.authorizations.set(fromAgentId, new Set());
    }
    
    this.authorizations.get(fromAgentId)!.add(toAgentId);
    
    // Publish the authorization update
    await this.eventBus.publish('oauth:authorization:update', {
      fromAgentId,
      toAgentId,
      authorized: true
    });
  }
  
  /**
   * Revoke access from one agent to another
   */
  public async revokeAccess(
    fromAgentId: string,
    toAgentId: string
  ): Promise<void> {
    if (this.authorizations.has(fromAgentId)) {
      this.authorizations.get(fromAgentId)!.delete(toAgentId);
    }
    
    // Publish the authorization update
    await this.eventBus.publish('oauth:authorization:update', {
      fromAgentId,
      toAgentId,
      authorized: false
    });
  }
  
  /**
   * Generate a service token for machine-to-machine communication
   */
  public generateServiceToken(
    clientId: string,
    scope: string[] = ['agent.communicate'],
    expiresIn: number = 3600 // 1 hour
  ): string {
    const accessToken = `service_token_${uuidv4()}`;
    
    this.serviceTokens.set(clientId, {
      accessToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000),
      scope
    });
    
    // Publish the token update
    this.eventBus.publish('oauth:token:update', {
      clientId,
      accessToken,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
      scope
    }).catch(err => {
      console.error('Error publishing token update:', err);
    });
    
    return accessToken;
  }
  
  /**
   * Get all authorizations for an agent
   */
  public getAgentAuthorizations(agentId: string): string[] {
    if (!this.authorizations.has(agentId)) {
      return [];
    }
    
    return Array.from(this.authorizations.get(agentId)!);
  }
  
  /**
   * Check if a token is about to expire
   */
  public isTokenExpiringSoon(
    clientId: string,
    thresholdSeconds: number = 300 // 5 minutes
  ): boolean {
    const clientTokens = this.clientTokens.get(clientId);
    if (!clientTokens) {
      return true; // No token, so it's effectively expired
    }
    
    const expireAt = clientTokens.expiresAt.getTime();
    const thresholdMs = thresholdSeconds * 1000;
    
    return Date.now() + thresholdMs >= expireAt;
  }
}
