import React, { useState } from 'react';
import './HelpCenter.css';
import {
  Container,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

const faqData = [
  {
    question: 'How do I compare quotes?',
    answer: 'You can easily compare quotes from different vendors by visiting your dashboard\'s "Quotes" section. Each quote displays the vendor\'s pricing, services included, and terms. Use the comparison view to see quotes side by side.'
  },
  {
    question: 'What is escrow payment?',
    answer: 'Escrow payment is a secure payment method where we hold your payment until the service is completed satisfactorily. This protects both you and the vendor. The funds are only released to the vendor after you confirm the service delivery.'
  },
  {
    question: 'Can I change my event date?',
    answer: 'Yes, you can change your event date by contacting your vendor directly through our platform. Go to your bookings, select the booking you want to modify, and use the "Request Date Change" option. The vendor will confirm if they\'re available for the new date.'
  },
  {
    question: 'How do refunds work?',
    answer: 'Refunds are processed according to our refund policy and the vendor\'s terms. For cancellations made 30+ days before the event, you\'ll receive a full refund minus processing fees. For cancellations within 30 days, refund amounts vary based on vendor policy.'
  }
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqData);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = faqData.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    );
    setFilteredFaqs(filtered);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', mb: 4, bgcolor: 'transparent' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          How Can We Help?
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Find answers to common questions or chat with our support team.
        </Typography>
      </Paper>

      <Box sx={{ position: 'relative', mb: 6 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Popular Questions
      </Typography>

      {filteredFaqs.map((faq, index) => (
        <Accordion key={index} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`faq-content-${index}`}
            id={`faq-header-${index}`}
          >
            <Typography variant="subtitle1">{faq.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              {faq.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Paper sx={{ p: 4, mt: 6, textAlign: 'center', bgcolor: '#f5f5f5' }}>
        <Typography variant="h5" gutterBottom>
          Still Need Help?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Contact us anytime:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<ChatIcon />}
            component={Link}
            to="/chat-support"
          >
            Chat Now
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
            href="mailto:support@shaadisetgo.com"
          >
            Email Support
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HelpCenter;