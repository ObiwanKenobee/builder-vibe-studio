import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { z } from 'zod';

// Security-related schemas
const UserRoleSchema = z.enum(['admin', 'custodian', 'creator', 'regenerator', 'citizen']);
const PermissionSchema = z.enum([
  'read:dashboard',
  'write:dashboard', 
  'read:analytics',
  'write:analytics',
  'read:financial_data',
  'write:financial_data',
  'read:sanctum_map',
  'write:sanctum_map',
  'manage:users',
  'manage:system',
  'audit:access',
  'export:data'
]);

const SecurityStateSchema = z.object({
  isAuthenticated: z.boolean(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    role: UserRoleSchema,
    permissions: z.array(PermissionSchema),
    mfaEnabled: z.boolean(),
    lastLogin: z.date().optional(),
    sessionExpiry: z.date().optional(),
    gdprConsent: z.boolean(),
    ccpaOptOut: z.boolean().optional(),
  }).nullable(),
  session: z.object({
    token: z.string(),
    refreshToken: z.string(),
    csrfToken: z.string(),
    expiresAt: z.date(),
  }).nullable(),
  auditLog: z.array(z.object({
    id: z.string(),
    userId: z.string(),
    action: z.string(),
    resource: z.string(),
    timestamp: z.date(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    result: z.enum(['success', 'failure', 'blocked']),
  })),
  encryptionKey: z.string().optional(),
});

type SecurityState = z.infer<typeof SecurityStateSchema>;
type UserRole = z.infer<typeof UserRoleSchema>;
type Permission = z.infer<typeof PermissionSchema>;

// Role-based permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'read:dashboard', 'write:dashboard', 'read:analytics', 'write:analytics',
    'read:financial_data', 'write:financial_data', 'read:sanctum_map', 'write:sanctum_map',
    'manage:users', 'manage:system', 'audit:access', 'export:data'
  ],
  custodian: [
    'read:dashboard', 'write:dashboard', 'read:analytics', 'read:financial_data', 
    'write:financial_data', 'read:sanctum_map', 'export:data'
  ],
  creator: [
    'read:dashboard', 'write:dashboard', 'read:analytics', 'read:sanctum_map'
  ],
  regenerator: [
    'read:dashboard', 'write:dashboard', 'read:analytics', 'read:financial_data', 
    'read:sanctum_map', 'export:data'
  ],
  citizen: [
    'read:dashboard', 'read:sanctum_map'
  ]
};

type SecurityAction = 
  | { type: 'LOGIN'; payload: { user: SecurityState['user']; session: SecurityState['session'] } }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; payload: { session: SecurityState['session'] } }
  | { type: 'ADD_AUDIT_LOG'; payload: { action: string; resource: string; result: 'success' | 'failure' | 'blocked' } }
  | { type: 'UPDATE_CONSENT'; payload: { gdprConsent?: boolean; ccpaOptOut?: boolean } }
  | { type: 'ENABLE_MFA' }
  | { type: 'SET_ENCRYPTION_KEY'; payload: { key: string } };

const initialState: SecurityState = {
  isAuthenticated: false,
  user: null,
  session: null,
  auditLog: [],
  encryptionKey: undefined,
};

function securityReducer(state: SecurityState, action: SecurityAction): SecurityState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        session: action.payload.session,
      };
    
    case 'LOGOUT':
      // Clear sensitive data
      return {
        ...initialState,
        auditLog: [...state.auditLog, {
          id: crypto.randomUUID(),
          userId: state.user?.id || 'unknown',
          action: 'logout',
          resource: 'auth',
          timestamp: new Date(),
          result: 'success',
        }],
      };
    
    case 'REFRESH_TOKEN':
      return {
        ...state,
        session: action.payload.session,
      };
    
    case 'ADD_AUDIT_LOG':
      const newAuditEntry = {
        id: crypto.randomUUID(),
        userId: state.user?.id || 'anonymous',
        action: action.payload.action,
        resource: action.payload.resource,
        timestamp: new Date(),
        ipAddress: undefined, // Would be set by server
        userAgent: navigator.userAgent,
        result: action.payload.result,
      };
      
      return {
        ...state,
        auditLog: [...state.auditLog.slice(-99), newAuditEntry], // Keep last 100 entries
      };
    
    case 'UPDATE_CONSENT':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          gdprConsent: action.payload.gdprConsent ?? state.user.gdprConsent,
          ccpaOptOut: action.payload.ccpaOptOut ?? state.user.ccpaOptOut,
        } : null,
      };
    
    case 'ENABLE_MFA':
      return {
        ...state,
        user: state.user ? { ...state.user, mfaEnabled: true } : null,
      };
    
    case 'SET_ENCRYPTION_KEY':
      return {
        ...state,
        encryptionKey: action.payload.key,
      };
    
    default:
      return state;
  }
}

interface SecurityContextType {
  state: SecurityState;
  dispatch: React.Dispatch<SecurityAction>;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  auditAction: (action: string, resource: string, result?: 'success' | 'failure' | 'blocked') => void;
  encryptData: (data: string) => Promise<string>;
  decryptData: (encryptedData: string) => Promise<string>;
  isSessionValid: () => boolean;
  getCSRFToken: () => string | null;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(securityReducer, initialState);

  // Check session validity
  const isSessionValid = (): boolean => {
    if (!state.session || !state.isAuthenticated) return false;
    return new Date() < state.session.expiresAt;
  };

  // Permission checking
  const hasPermission = (permission: Permission): boolean => {
    if (!state.user) return false;
    return state.user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!state.user) return false;
    return permissions.some(permission => state.user!.permissions.includes(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  // Audit logging
  const auditAction = (action: string, resource: string, result: 'success' | 'failure' | 'blocked' = 'success') => {
    dispatch({ type: 'ADD_AUDIT_LOG', payload: { action, resource, result } });
  };

  // CSRF token
  const getCSRFToken = (): string | null => {
    return state.session?.csrfToken || null;
  };

  // Encryption utilities (simplified - in production use proper crypto libraries)
  const encryptData = async (data: string): Promise<string> => {
    if (!state.encryptionKey) throw new Error('Encryption key not available');
    
    // In production, use proper encryption like Web Crypto API
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const encoded = encoder.encode(data + state.encryptionKey);
    const encrypted = btoa(decoder.decode(encoded));
    return encrypted;
  };

  const decryptData = async (encryptedData: string): Promise<string> => {
    if (!state.encryptionKey) throw new Error('Encryption key not available');
    
    // In production, use proper decryption
    try {
      const decoded = atob(encryptedData);
      const data = decoded.replace(state.encryptionKey, '');
      return data;
    } catch (error) {
      throw new Error('Decryption failed');
    }
  };

  // Auto-logout on session expiry
  useEffect(() => {
    if (state.isAuthenticated && !isSessionValid()) {
      auditAction('auto_logout', 'auth', 'success');
      dispatch({ type: 'LOGOUT' });
    }
  }, [state.isAuthenticated, state.session]);

  // Generate encryption key on mount
  useEffect(() => {
    if (!state.encryptionKey) {
      const key = crypto.randomUUID();
      dispatch({ type: 'SET_ENCRYPTION_KEY', payload: { key } });
    }
  }, []);

  const value: SecurityContextType = {
    state,
    dispatch,
    hasPermission,
    hasAnyPermission,
    hasRole,
    auditAction,
    encryptData,
    decryptData,
    isSessionValid,
    getCSRFToken,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withPermission<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermissions: Permission[]
) {
  return function ProtectedComponent(props: T) {
    const { hasAnyPermission, auditAction } = useSecurity();
    
    if (!hasAnyPermission(requiredPermissions)) {
      auditAction('access_denied', 'protected_route', 'blocked');
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-foreground/70">You don't have permission to access this resource.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Export schemas and types for use in other components
export { UserRoleSchema, PermissionSchema, ROLE_PERMISSIONS };
export type { SecurityState, UserRole, Permission };
