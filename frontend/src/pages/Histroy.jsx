import React from 'react';
import useFetch from '../Hooks/useFetch';
import Loading from '../components/Loading';
import Error from '../components/Error';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Typography,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const History = () => {
  const [history, loading, error] = useFetch('/api/chat_history');

  if (loading) return <Loading message="Loading chat history..." />;
  if (error) return <Error message={error} />;

  return (
    <Container
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        minHeight: '100vh',
        py: 5,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Chat History
      </Typography>

      {history && history.length > 0 ? (
        history.map((item, index) => (
          <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            >
              <Typography variant="h6" sx={{ pl: 2, fontWeight: 600, color: 'text.dark' }}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
              <Typography variant="body2" color="text.dark">
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography
          variant="body1"
          color="error"
          align="center"
          sx={{ mt: 4 }}
        >
          No chat history found.
        </Typography>
      )}
    </Container>
  );
};

export default History;
