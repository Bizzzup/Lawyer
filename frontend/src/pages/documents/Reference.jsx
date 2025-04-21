import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import useFetch from '../../Hooks/useFetch';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Reference = () => {
  const [documents, loading, error] = useFetch('api/document_references');

  if (loading) return <Loading message="Loading document references..." />;
  if (error) return <Error message={error} />;

  return (
    <Container
      sx={{
        width: '100%',
        maxWidth: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: 5,
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        Document References
      </Typography>

      {documents?.length > 0 ? (
        documents.map((item, index) => (
          <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            >
              <Typography variant="h6" sx={{ pl: 2, fontWeight: 600, color: 'text.dark' }}>
                {item.reference}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
              <Typography variant="body2" color="text.dark">
                {item.context || 'No content available.'}
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
          No documents found
        </Typography>
      )}
    </Container>
  );
};

export default Reference;
