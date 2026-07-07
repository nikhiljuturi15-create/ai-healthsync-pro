const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Token management
const TOKEN_KEY = 'healthsync_token';
const REFRESH_TOKEN_KEY = 'healthsync_refresh_token';
const USER_KEY = 'healthsync_user';

export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUser: (): any => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAll: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  setAuthData: (data: { token: string; refreshToken: string; user: any }): void => {
    tokenManager.setToken(data.token);
    tokenManager.setRefreshToken(data.refreshToken);
    tokenManager.setUser(data.user);
  }
};

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  const token = tokenManager.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'An error occurred',
        error: result.message || 'Request failed'
      };
    }

    return {
      success: true,
      data: result.data,
      message: result.message
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      error: 'Network error'
    };
  }
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    fullName: string;
    role?: string;
    phone?: string;
  }) => {
    const result = await apiRequest<{
      user: any;
      token: string;
      refreshToken: string;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      tokenManager.setAuthData({
        token: result.data.token,
        refreshToken: result.data.refreshToken,
        user: result.data.user
      });
    }

    return result;
  },

  login: async (email: string, password: string) => {
    const result = await apiRequest<{
      user: any;
      token: string;
      refreshToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (result.success && result.data) {
      tokenManager.setAuthData({
        token: result.data.token,
        refreshToken: result.data.refreshToken,
        user: result.data.user
      });
    }

    return result;
  },

  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    tokenManager.clearAll();
    return { success: true };
  },

  getCurrentUser: async () => {
    const result = await apiRequest<any>('/auth/me');
    if (result.success && result.data) {
      tokenManager.setUser(result.data);
    }
    return result;
  },

  verifyToken: async () => {
    const token = tokenManager.getToken();
    if (!token) {
      return { success: false, message: 'No token found' };
    }
    return apiRequest<any>('/auth/verify');
  },

  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: 'No refresh token' };
    }

    const result = await apiRequest<{ token: string; refreshToken: string }>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (result.success && result.data) {
      tokenManager.setToken(result.data.token);
      tokenManager.setRefreshToken(result.data.refreshToken);
    }

    return result;
  },

  updateProfile: async (data: Partial<{
    fullName: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
    address: any;
    language: string;
  }>) => {
    const result = await apiRequest<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (result.success && result.data) {
      tokenManager.setUser(result.data);
    }

    return result;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Check server health
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};

export { API_URL };
