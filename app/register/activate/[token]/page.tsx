'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function ActivatePage() {
  const { token } = useParams() as { token: string };
  const [message, setMessage] = useState('');
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
		axios.get<{ detail?: string }>(`${baseURL}/api/activate/${token}`)
			.then(res => {
				setMessage(res.data.detail || 'Activated');
			})
			.catch(err => {
				setMessage(err.response?.data?.detail || 'Activation failed');
			});
    }, [token]);
	redirect('/login');
	return (
    <div>
      <h1>Account Activation</h1>
      <p>{message}</p>
    </div>
  );
}