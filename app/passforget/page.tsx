'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
      <button onClick={() => router.push('/login')}>Back to Login</button>
    </div>
  );
}