import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useFetch from '../../Hooks/useFetch';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const Monetary = () => {
  const [monetary, loading, error] = useFetch('api/monetary_values');

  if (loading) return <Loading message="Loading monetary values..." />;
  if (error) return <Error message={error.message} />;

  if (!monetary || !monetary.loan_amounts) {
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
          Monetary
        </Typography>
        <Typography variant="body1" color="error" align="center">
          No monetary data available.
        </Typography>
      </Container>
    );
  }

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
        Monetary
      </Typography>

      {monetary.loan_amounts.length > 0 ? (
        monetary.loan_amounts.map((item, index) => (
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
                Amount {item.amount}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
              <Typography variant="body2" color="text.dark">
                {item.context || 'No context available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body1" color="error" align="center">
          No monetary data available.
        </Typography>
      )}
    </Container>
  );
};

export default Monetary;
