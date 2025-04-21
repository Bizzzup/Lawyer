import React from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';

const Home = () => {
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
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, backgroundColor: '#f9f9f9' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{xs: 12, md: 6}} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Lawyer's Assistant
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Trusted Legal Advisors Committed to Justice
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our team of experienced lawyers provides expert legal solutions tailored to your needs.
              Whether you need corporate consultation, litigation support, or personal legal services,
              we are here to help you every step of the way.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
