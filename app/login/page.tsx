'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or Email:</label>
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <button onClick={() => router.push('/register')}>Register</button>
        <button onClick={() => router.push('/passforget')}>Forgot Password</button>
      </div>
    </div>
  );
}