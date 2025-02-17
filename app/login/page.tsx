'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ access: string; refresh: string }>(baseURL+'/api/login/', {
        username_or_email: usernameOrEmail,
        password,
      });
      const { access, refresh } = res.data;
      // Cookie に保存（ライブラリ js-cookie を利用）
      Cookies.set('access', access);
      Cookies.set('refresh', refresh);
      router.push('/control');
    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Username or Email"
            variant="outlined"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
            <Button
              variant="text"
              onClick={() => router.push('/register')}
            >
              Register
            </Button>
            <Button
              variant="text"
              onClick={() => router.push('/passforget')}
            >
              Forgot Password
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}