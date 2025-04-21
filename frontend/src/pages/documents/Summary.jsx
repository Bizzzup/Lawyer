import React from 'react';
import useFetch from '../../Hooks/useFetch';
import { Container, Typography, Paper } from '@mui/material';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

const Summary = () => {
  const [data, loading, error] = useFetch('/api/summary');

  if (loading) return <Loading message="Loading summary..." />;
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
      <Typography variant="h4" sx={{ mb: 4 }} gutterBottom>
        Summary of this file
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            lineHeight: 1.8,
            color: 'text.primary',
            whiteSpace: 'pre-wrap',
          }}
        >
          {data?.summary || 'No summary available'}
        </Typography>
      </Paper>
    </Container>
  );
};

export default Summary;
