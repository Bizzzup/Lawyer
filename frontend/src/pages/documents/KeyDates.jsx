import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import useFetch from '../../Hooks/useFetch';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const KeyDates = () => {
  const [dates, loading, error] = useFetch('api/dates');

  if (loading) return <Loading message="Loading dates..." />;
  if (error) return <Error message={error.message || 'Failed to load dates'} />;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const renderAccordion = (items) =>
    items.map((item, index) => (
      <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}-content`}
          id={`panel${index}-header`}
          sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
        >
          <Typography
            variant="h6"
            sx={{ pl: 2, fontWeight: 600, color: 'text.dark' }}
          >
            {formatDate(item.date)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
          <Typography variant="body2" color="text.dark">
            {item.context || 'No context provided.'}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ));

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
      <Typography variant="h4" sx={{ mb: 4 }}>
        Key Dates
      </Typography>

      {dates?.key_dates?.length > 0 ? (
        renderAccordion(dates.key_dates)
      ) : (
        <Typography variant="body1" color="error" align="center">
          No key dates found.
        </Typography>
      )}

      {dates?.other_dates?.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mt: 5, mb: 2 }}>
            Other Dates
          </Typography>
          {renderAccordion(dates.other_dates)}
        </>
      )}
    </Container>
  );
};

export default KeyDates;
