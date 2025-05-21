import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/api/bookingService';
import { showNotification } from './notificationSlice';

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  selectedBooking: null,
  loadingStates: {}, // Track loading states for individual bookings
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (filters, { rejectWithValue, dispatch }) => {
    try {
      const data = await bookingService.getAllBookings(filters);
      dispatch(showNotification({
        type: 'success',
        message: 'Bookings loaded successfully',
        duration: 3000,
      }));
      return data;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to load bookings',
        duration: 5000,
      }));
      return rejectWithValue(error);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ bookingId, status }, { rejectWithValue, dispatch }) => {
    try {
      const data = await bookingService.updateBookingStatus(bookingId, status);
      dispatch(showNotification({
        type: 'success',
        message: `Booking status updated to ${status}`,
        duration: 3000,
      }));
      return data;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to update booking status',
        duration: 5000,
      }));
      return rejectWithValue(error);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue, dispatch }) => {
    try {
      const data = await bookingService.createBooking(bookingData);
      dispatch(showNotification({
        type: 'success',
        message: 'Booking created successfully',
        duration: 3000,
      }));
      return data;
    } catch (error) {
      dispatch(showNotification({
        type: 'error',
        message: error.message || 'Failed to create booking',
        duration: 5000,
      }));
      return rejectWithValue(error);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch bookings';
      })
      // Update booking status
      .addCase(updateBookingStatus.pending, (state, action) => {
        const bookingId = action.meta.arg.bookingId;
        state.loadingStates[bookingId] = true;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updatedBooking = action.payload;
        const index = state.bookings.findIndex(booking => booking._id === updatedBooking._id);
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
        state.loadingStates[updatedBooking._id] = false;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        const bookingId = action.meta.arg.bookingId;
        state.loadingStates[bookingId] = false;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create booking';
      });
  },
});

export const { setSelectedBooking, clearSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer; 