import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './BookingCalendar.css';

const BookingCalendar = ({ bookings }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const bookingsForDay = bookings.filter(booking => {
      const bookingDate = new Date(booking.eventDate);
      return bookingDate.getDate() === day &&
             bookingDate.getMonth() === currentDate.getMonth() &&
             bookingDate.getFullYear() === currentDate.getFullYear();
    });
    setSelectedDate(selectedDate);
    setSelectedBookings(bookingsForDay);
    setDialogOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Add day names
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={`day-${i}`} className="day-header">
          {dayNames[i]}
        </div>
      );
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.eventDate);
        return (
          bookingDate.getDate() === day &&
          bookingDate.getMonth() === currentDate.getMonth() &&
          bookingDate.getFullYear() === currentDate.getFullYear()
        );
      });

      const isToday = 
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`calendar-day ${isToday ? 'today' : ''}`}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            {day}
          </Typography>
          {dayBookings.map((booking) => (
            <div
              key={booking._id}
              className={`event-chip status-${booking.status}`}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/bookings/${booking._id}`);
              }}
            >
              {booking.customerName}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h6">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </div>

      <div className="calendar-grid">
        {renderCalendar()}
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Bookings for {selectedDate?.toLocaleDateString()}
        </DialogTitle>
        <DialogContent className="booking-dialog">
          {selectedBookings.length > 0 ? (
            selectedBookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <Typography variant="subtitle1">
                  {booking.customerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.guestCount} Guests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Budget: ₹{booking.budget}
                </Typography>
              </div>
            ))
          ) : (
            <Typography>No bookings for this date</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingCalendar; 