import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser as getCurrentUserService,
  refreshToken as refreshTokenService,
  updateProfile as updateProfileService
} from '../../services/auth';

// Initialize state from localStorage with proper role handling
const getUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Ensure user has a role, prioritize stored role
      user.role = storedRole || user.role;
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    // Clear potentially corrupted data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Registering user with data:', { ...userData, password: '[REDACTED]' });
      const response = await registerService(userData);
      console.log('Registration response:', { ...response, user: { ...response.user, password: '[REDACTED]' } });
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Logging in user:', { ...credentials, password: '[REDACTED]' });
      const response = await loginService(credentials);
      console.log('Login response:', { ...response, user: { ...response.user, password: '[REDACTED]' } });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Logging out user');
      const response = await logoutService();
      console.log('Logout response:', response);
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found');
        return rejectWithValue('No authentication token');
      }
      console.log('Fetching current user');
      const data = await getCurrentUserService();
      console.log('Current user data:', { ...data, password: '[REDACTED]' });
      return data;
    } catch (error) {
      console.error('Get current user error:', error);
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token to refresh');
        return rejectWithValue('No authentication token');
      }
      console.log('Refreshing token');
      const data = await refreshTokenService();
      console.log('Token refresh response:', { ...data, token: '[REDACTED]' });
      return data.user;
    } catch (error) {
      console.error('Token refresh error:', error);
      return rejectWithValue(error.message || 'Failed to refresh token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user data';
      })
      // Refresh Token
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to refresh token';
        // Clear auth state on token refresh failure
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;