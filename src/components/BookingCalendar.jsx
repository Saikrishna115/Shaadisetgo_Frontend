import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const BookingCalendar = ({ bookings }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayBookings = bookings.filter(booking => {
      const bookingDate = new Date(booking.eventDate);
      return (
        bookingDate.getDate() === day &&
        bookingDate.getMonth() === currentDate.getMonth() &&
        bookingDate.getFullYear() === currentDate.getFullYear()
      );
    });
    setSelectedDate(date);
    setSelectedBookings(dayBookings);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day names
    for (let i = 0; i < 7; i++) {
      days.push(
        <Box
          key={`day-${i}`}
          sx={{
            p: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          {dayNames[i]}
        </Box>
      );
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <Box
          key={`empty-${i}`}
          sx={{
            p: 1,
            height: 100,
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        return (
          bookingDate.getDate() === day &&
          bookingDate.getMonth() === currentDate.getMonth() &&
          bookingDate.getFullYear() === currentDate.getFullYear()
        );
      });

      days.push(
        <Box
          key={day}
          onClick={() => handleDateClick(day)}
          sx={{
            p: 1,
            height: 100,
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {day}
          </Typography>
          {dayBookings.map((booking) => (
            <Chip
              key={booking._id}
              label={booking.customerName}
              size="small"
              color={
                booking.status === 'pending' ? 'warning' :
                booking.status === 'confirmed' ? 'success' :
                booking.status === 'rejected' ? 'error' :
                'default'
              }
              sx={{ mb: 0.5, width: '100%', justifyContent: 'flex-start' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookings/${booking._id}`);
              }}
            />
          ))}
        </Box>
      );
    }

    return days;
  };

  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Grid container columns={7} sx={{ border: '1px solid', borderColor: 'divider' }}>
          {renderCalendar()}
        </Grid>
      </Paper>

      <Dialog
        open={Boolean(selectedDate)}
        onClose={() => setSelectedDate(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Bookings for {selectedDate?.toLocaleDateString()}
        </DialogTitle>
        <DialogContent>
          {selectedBookings.length > 0 ? (
            selectedBookings.map((booking) => (
              <Box
                key={booking._id}
                sx={{
                  p: 2,
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Typography variant="subtitle1">
                  {booking.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.guestCount} Guests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget: ₹{booking.budget}
                </Typography>
                <Chip
                  label={booking.status}
                  color={
                    booking.status === 'pending' ? 'warning' :
                    booking.status === 'confirmed' ? 'success' :
                    booking.status === 'rejected' ? 'error' :
                    'default'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No bookings for this date
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDate(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingCalendar; 