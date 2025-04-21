import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useFetch from '../Hooks/useFetch';
import Loading from '../components/Loading';
import Error from '../components/Error';

const AllCase = () => {
  const [data, loading, error] = useFetch('api/all_case');

  if (loading) return <Loading message="Loading cases..." />;
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
        All Cases
      </Typography>

      {data && Object.entries(data).length > 0 ? (
        Object.entries(data).map(([key, value], index) => (
          <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            >
              <Typography variant="h6" sx={{ pl: 2, fontWeight: 600, color: 'text.secondary' }}>
                {key}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
              <Box mb={1}>
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  Description:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.description || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  Legal Provisions:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.legal_provisions || 'N/A'}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body1" color="error" align="center">
          No cases found.
        </Typography>
      )}
    </Container>
  );
};

export default AllCase;
