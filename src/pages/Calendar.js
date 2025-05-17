import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const Calendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [vendorSettings, setVendorSettings] = useState({
    maxEventsPerDay: 1,
    workingHours: {
      start: '09:00',
      end: '18:00'
    }
  });
  const [selectedDateData, setSelectedDateData] = useState({
    eventsBooked: 0,
    isFullyBooked: false,
    notes: ''
  });

  useEffect(() => {
    fetchVendorData();
    fetchBookings();
  }, []);

  const fetchVendorData = async () => {
    try {
      const response = await axios.get('/vendors/profile');
      const vendorData = response.data.vendor;
      setVendorSettings({
        maxEventsPerDay: vendorData.maxEventsPerDay || 1,
        workingHours: vendorData.workingHours || {
          start: '09:00',
          end: '18:00'
        }
      });
    } catch (err) {
      console.error('Error fetching vendor data:', err);
      setError('Failed to load vendor settings');
    }
  };

  const fetchBookings = async () => {
    try {
      const [bookingsResponse, availabilityResponse] = await Promise.all([
        axios.get('/bookings/vendor'),
        axios.get('/vendors/availability')
      ]);

      const bookingEvents = bookingsResponse.data.map(booking => ({
        title: `Booking: ${booking.customerName}`,
        start: new Date(booking.eventDate),
        end: new Date(booking.eventDate),
        allDay: true,
        resource: booking
      }));

      const availabilityEvents = availabilityResponse.data.map(day => ({
        title: `Available (${day.eventsBooked}/${vendorSettings.maxEventsPerDay})`,
        start: new Date(day.date),
        end: new Date(day.date),
        allDay: true,
        resource: day,
        className: day.isFullyBooked ? 'fully-booked' : 'available'
      }));

      setEvents([...bookingEvents, ...availabilityEvents]);
      setError('');
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      setError('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (slotInfo) => {
    const selectedDate = slotInfo.start;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    
    // Find existing availability data for the selected date
    const existingData = events.find(event => 
      format(event.start, 'yyyy-MM-dd') === dateStr && event.resource?.eventsBooked !== undefined
    );

    setSelectedDate(selectedDate);
    setSelectedDateData({
      eventsBooked: existingData?.resource?.eventsBooked || 0,
      isFullyBooked: existingData?.resource?.isFullyBooked || false,
      notes: existingData?.resource?.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSaveAvailability = async () => {
    try {
      await axios.post('/vendors/availability', {
        date: selectedDate,
        ...selectedDateData
      });

      fetchBookings(); // Refresh calendar data
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving availability:', err);
      setError('Failed to save availability settings');
    }
  };

  const handleUpdateSettings = async () => {
    try {
      await axios.put('/vendors/settings', vendorSettings);
      fetchBookings(); // Refresh calendar data
    } catch (err) {
      console.error('Error updating vendor settings:', err);
      setError('Failed to update vendor settings');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Event Calendar
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                type="number"
                label="Maximum Events Per Day"
                value={vendorSettings.maxEventsPerDay}
                onChange={(e) => setVendorSettings({
                  ...vendorSettings,
                  maxEventsPerDay: parseInt(e.target.value)
                })}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="time"
                label="Working Hours Start"
                value={vendorSettings.workingHours.start}
                onChange={(e) => setVendorSettings({
                  ...vendorSettings,
                  workingHours: {
                    ...vendorSettings.workingHours,
                    start: e.target.value
                  }
                })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                type="time"
                label="Working Hours End"
                value={vendorSettings.workingHours.end}
                onChange={(e) => setVendorSettings({
                  ...vendorSettings,
                  workingHours: {
                    ...vendorSettings.workingHours,
                    end: e.target.value
                  }
                })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                onClick={handleUpdateSettings}
                fullWidth
              >
                Save Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 2, height: '70vh' }}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            defaultView="month"
            selectable
            onSelectSlot={handleDateSelect}
          />
        </Paper>
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          Manage Availability for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Events Booked"
                  type="number"
                  value={selectedDateData.eventsBooked}
                  onChange={(e) => setSelectedDateData({
                    ...selectedDateData,
                    eventsBooked: parseInt(e.target.value)
                  })}
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: vendorSettings.maxEventsPerDay } }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Availability Status</InputLabel>
                  <Select
                    value={selectedDateData.isFullyBooked}
                    onChange={(e) => setSelectedDateData({
                      ...selectedDateData,
                      isFullyBooked: e.target.value
                    })}
                  >
                    <MenuItem value={false}>Available</MenuItem>
                    <MenuItem value={true}>Fully Booked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  multiline
                  rows={4}
                  value={selectedDateData.notes}
                  onChange={(e) => setSelectedDateData({
                    ...selectedDateData,
                    notes: e.target.value
                  })}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveAvailability} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Calendar; 