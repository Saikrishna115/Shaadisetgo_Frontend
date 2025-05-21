import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/api/authService';

// Initialize state from localStorage
const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
const token = localStorage.getItem('token');

const initialState = {
  user,
  loading: false,
  error: null,
  isAuthenticated: !!token,
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      // Store auth data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue({ message: 'No authentication token' });
      }
      const data = await authService.getCurrentUser();
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue({ message: 'No authentication token' });
      }
      const data = await authService.refreshToken();
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
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
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Registration failed';
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
        state.error = action.payload?.message || 'Login failed';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
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
        if (action.payload?.message === 'No authentication token') {
          state.user = null;
          state.isAuthenticated = false;
          state.error = null;
        } else {
          state.error = action.payload?.message || 'Failed to get user data';
        }
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        // Only set error if it's not a "No authentication token" message
        if (action.payload?.message !== 'No authentication token') {
          state.error = action.payload?.message || 'Failed to refresh token';
        }
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(profileData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export default authSlice.reducer;