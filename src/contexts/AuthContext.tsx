import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, tokenManager } from '../lib/api';

// Types matching the original for compatibility
export type UserRole = 'admin' | 'doctor' | 'receptionist' | 'patient';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  pincode: string | null;
  language: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: any | null;
  profile: Profile | null;
  doctorProfile: any | null;
  patientProfile: any | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert API user to Profile type
function mapUserToProfile(user: any): Profile {
  return {
    id: user.id || user._id,
    email: user.email,
    full_name: user.fullName,
    phone: user.phone || null,
    avatar_url: user.avatarUrl || null,
    role: user.role,
    date_of_birth: user.dateOfBirth || null,
    gender: user.gender || null,
    address: user.address?.street || null,
    city: user.address?.city || null,
    state: user.address?.state || null,
    country: user.address?.country || 'India',
    pincode: user.address?.pincode || null,
    language: user.language || 'en',
    is_active: user.isActive ?? true,
    created_at: user.createdAt || new Date().toISOString(),
    updated_at: user.updatedAt || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    doctorProfile: null,
    patientProfile: null,
    session: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Initialize auth state from stored tokens
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = tokenManager.getToken();
        const storedUser = tokenManager.getUser();

        if (!token || !storedUser) {
          if (mounted) {
            setState(prev => ({
              ...prev,
              loading: false,
              isAuthenticated: false,
            }));
          }
          return;
        }

        // Verify token with backend
        const result = await authApi.verifyToken();

        if (mounted) {
          if (result.success && result.data?.user) {
            const profile = mapUserToProfile(result.data.user);
            setState({
              user: result.data.user,
              profile,
              doctorProfile: null,
              patientProfile: null,
              session: { access_token: token },
              loading: false,
              error: null,
              isAuthenticated: true,
            });
          } else {
            // Token invalid, try refresh
            const refreshResult = await authApi.refreshToken();
            if (refreshResult.success && refreshResult.data) {
              const profile = mapUserToProfile(storedUser);
              setState({
                user: storedUser,
                profile,
                doctorProfile: null,
                patientProfile: null,
                session: { access_token: refreshResult.data.token },
                loading: false,
                error: null,
                isAuthenticated: true,
              });
            } else {
              // Refresh failed, clear tokens
              tokenManager.clearAll();
              setState({
                user: null,
                profile: null,
                doctorProfile: null,
                patientProfile: null,
                session: null,
                loading: false,
                error: null,
                isAuthenticated: false,
              });
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          tokenManager.clearAll();
          setState({
            user: null,
            profile: null,
            doctorProfile: null,
            patientProfile: null,
            session: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await authApi.login(email, password);

      if (!result.success || !result.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.message || 'Login failed',
        }));
        return { error: result.message || 'Login failed' };
      }

      const { user, token } = result.data;
      const profile = mapUserToProfile(user);

      setState({
        user,
        profile,
        doctorProfile: null,
        patientProfile: null,
        session: { access_token: token },
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return { error: message };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const result = await authApi.register({
        email,
        password,
        fullName,
        role,
      });

      if (!result.success || !result.data) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.message || 'Registration failed',
        }));
        return { error: result.message || 'Registration failed' };
      }

      const { user, token } = result.data;
      const profile = mapUserToProfile(user);

      setState({
        user,
        profile,
        doctorProfile: null,
        patientProfile: null,
        session: { access_token: token },
        loading: false,
        error: null,
        isAuthenticated: true,
      });

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return { error: message };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearAll();
      setState({
        user: null,
        profile: null,
        doctorProfile: null,
        patientProfile: null,
        session: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) {
      return { error: 'Not authenticated' };
    }

    try {
      // Map profile fields to API fields
      const apiUpdates: any = {};
      if (updates.full_name) apiUpdates.fullName = updates.full_name;
      if (updates.phone) apiUpdates.phone = updates.phone;
      if (updates.date_of_birth) apiUpdates.dateOfBirth = updates.date_of_birth;
      if (updates.gender) apiUpdates.gender = updates.gender;
      if (updates.language) apiUpdates.language = updates.language;
      if (updates.address || updates.city || updates.state || updates.pincode) {
        apiUpdates.address = {
          street: updates.address,
          city: updates.city,
          state: updates.state,
          pincode: updates.pincode,
          country: updates.country,
        };
      }

      const result = await authApi.updateProfile(apiUpdates);

      if (!result.success || !result.data) {
        return { error: result.message || 'Update failed' };
      }

      const profile = mapUserToProfile(result.data);
      setState(prev => ({
        ...prev,
        user: result.data,
        profile,
      }));

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Update failed';
      return { error: message };
    }
  };

  const refreshProfile = async () => {
    if (!state.user) return;

    try {
      const result = await authApi.getCurrentUser();
      if (result.success && result.data) {
        const profile = mapUserToProfile(result.data);
        setState(prev => ({
          ...prev,
          user: result.data,
          profile,
        }));
      }
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { AuthContextType };
