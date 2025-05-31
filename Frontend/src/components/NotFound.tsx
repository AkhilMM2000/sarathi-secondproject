import { Button, Container, Typography, Box, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Stack spacing={4} textAlign="center" width="100%">
        

        <Typography variant="h2" fontWeight="bold" color="primary">
          404 - Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary">
          The page you're looking for doesn’t exist or has been moved. Let's get you back to safety.
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/')}
            sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
          >
            Go to Home
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
