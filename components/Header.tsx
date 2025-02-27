'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuthContext } from '@/app/context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { isLoggedIn, setIsLoggedIn } = useAuthContext();

  const handleLogout = async () => {
    try {
      const refresh = Cookies.get('refresh');
      if (!refresh) {
        Cookies.remove('access');
        Cookies.remove('refresh');
        setIsLoggedIn(false);
        router.push('/login');
        return;
      }
      await axios.post('/api/logout/', { refresh });
      Cookies.remove('access');
      Cookies.remove('refresh');
      setIsLoggedIn(false);
      router.push('/login');
    } catch (error) {
      console.error(error);
      Cookies.remove('access');
      Cookies.remove('refresh');
      setIsLoggedIn(false);
      router.push('/login');
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}>MyApp</Typography>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => router.push('/register')}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}