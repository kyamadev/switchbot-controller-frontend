'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';

export default function PassForgetPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(baseURL+'/api/resetpassword/', { email });
      alert('Password reset email sent. Check your email.');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Request failed');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          onSubmit={handleSubmit}
        >
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Send Reset Email
          </Button>
          <Button variant="text" onClick={() => router.push('/login')}>
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}