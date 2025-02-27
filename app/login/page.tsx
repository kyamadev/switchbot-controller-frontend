'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
} from '@mui/material';
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch(baseURL+"/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      const { access, refresh } = data;
      Cookies.set('access', access);
      Cookies.set('refresh', refresh);
      router.push('/control');
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
}