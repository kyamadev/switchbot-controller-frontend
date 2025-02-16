'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ResetPasswordConfirmPage() {
  const { token } = useParams() as { token: string };
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [valid, setValid] = useState(false);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    axios.get<{ detail: string }>(`${baseURL}/api/resetpassword_confirm/${token}`)
      .then(res => {
        setMessage(res.data.detail);
        setValid(true);
      })
      .catch(err => {
        setMessage(err.response?.data?.detail || 'Unknown error');
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<{ detail: string }>(`${baseURL}/api/resetpassword_confirm/${token}/`, { password });
      setMessage(res.data.detail);
      setValid(false); // もう再度送信不可にする等
    } catch (err: any) {
      setMessage(err.response?.data?.detail || 'Unknown error');
    }
  };

  return (
    <div>
      <h1>Password Reset</h1>
      <p>{message}</p>
      {valid && (
        <form onSubmit={handleSubmit}>
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Set New Password</button>
        </form>
      )}
    </div>
  );
}