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

const Sections = () => {
  const [sections, loading, error] = useFetch('api/sections');

  if (loading) return <Loading message="Loading sections..." />;
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
        Sections
      </Typography>

      {sections && sections.length > 0 ? (
        sections.map((section, index) => (
          <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
            >
              <Typography variant="h6" sx={{ pl: 2, fontWeight: 600, color: 'text.dark' }}>
                Section {section.section_id}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}>
              <Typography variant="body2" color="text.dark">
                {section.content || 'No content available.'}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant="body1" color="error" align="center">
          No sections found.
        </Typography>
      )}
    </Container>
  );
};

export default Sections;
