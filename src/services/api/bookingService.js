import api from './config';

class BookingService {
  async getAllBookings(filters = {}) {
    try {
      const response = await api.get('/bookings', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getBookingById(id) {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createBooking(bookingData) {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateBooking(id, bookingData) {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateBookingStatus(id, status) {
    try {
      const response = await api.patch(`/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteBooking(id) {
    try {
      const response = await api.delete(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    return {
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    };
  }
}

export default new BookingService(); 