import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole, Doctor, Patient } from '../lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  doctorProfile: Doctor | null;
  patientProfile: Patient | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    doctorProfile: null,
    patientProfile: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted && session?.user) {
          await fetchUserProfile(session.user.id, session);
        } else if (mounted) {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Authentication error',
          }));
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id, session);
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          profile: null,
          doctorProfile: null,
          patientProfile: null,
          session: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, session: Session | null) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      let doctorProfile = null;
      let patientProfile = null;

      if (profile?.role === 'doctor') {
        const { data: doctor } = await supabase
          .from('doctors')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle();
        doctorProfile = doctor;
      } else if (profile?.role === 'patient') {
        const { data: patient } = await supabase
          .from('patients')
          .select('*')
          .eq('profile_id', userId)
          .maybeSingle();
        patientProfile = patient;
      }

      setState({
        user: session?.user ?? null,
        profile,
        doctorProfile,
        patientProfile,
        session,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setState(prev => ({ ...prev, loading: false, error: error.message }));
        return { error: error.message };
      }
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

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role },
        },
      });

      if (authError) {
        setState(prev => ({ ...prev, loading: false, error: authError.message }));
        return { error: authError.message };
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        });

        if (profileError) {
          setState(prev => ({ ...prev, loading: false, error: profileError.message }));
          return { error: profileError.message };
        }

        if (role === 'patient') {
          await supabase.from('patients').insert({
            profile_id: authData.user.id,
            allergies: [],
            chronic_conditions: [],
          });
        }
      }

      return { error: null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({ ...prev, loading: false, error: message }));
      return { error: message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      profile: null,
      doctorProfile: null,
      patientProfile: null,
      session: null,
      loading: false,
      error: null,
    });
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!state.user) return { error: 'Not authenticated' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', state.user.id);

      if (error) return { error: error.message };

      await fetchUserProfile(state.user.id, state.session);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Update failed' };
    }
  };

  const refreshProfile = async () => {
    if (state.user) {
      await fetchUserProfile(state.user.id, state.session);
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
