'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  remoteType?: string;
}

export default function ControlPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [credentialMissing, setCredentialMissing] = useState(false);
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const access = Cookies.get('access');
        const res = await axios.get<{ devices: Device[] }>(baseURL+'/api/control/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        setDevices(res.data.devices);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data.detail === "SwitchBot credentials not registered."
        ) {
          setCredentialMissing(true);
        } else {
          console.error(error);
        }
      }
    };
    fetchDevices();
  }, []);

  const handleLogout = async () => {
    try {
      const refresh = Cookies.get('refresh');
      const access = Cookies.get('access');
      if (!refresh) {
        // リフレッシュトークンが無い → 直接ログインへ遷移
        Cookies.remove('access');
        Cookies.remove('refresh');
        router.push('/login');
        return;
      }
      // /api/logout へ POST
      await axios.post(baseURL+'/api/logout/', { refresh }, {
        headers: { Authorization: `Bearer ${access}` },
      });
      // 成功したらクッキー削除 + /login 遷移
      Cookies.remove('access');
      Cookies.remove('refresh');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert("Failed to logout");
    }
  };

  const handleTokenRegister = async () => {
    const token = prompt("Enter your SwitchBot token:");
    const secret = prompt("Enter your SwitchBot secret:");
    const access = Cookies.get('access');
    if (token && secret) {
      try {
        await axios.put(baseURL+'/api/token/', { token, secret }, {
          headers: { Authorization: `Bearer ${access}` },
        });
        alert("SwitchBot credentials registered.");
        setCredentialMissing(false);
        const res = await axios.get<{ devices: Device[] }>(baseURL+'/api/control/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        setDevices(res.data.devices);
      } catch (error) {
        console.error(error);
        alert("Failed to register credentials.");
      }
    }
  };

  return (
    <div>
      <h1>Device Control</h1>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </button>
      {credentialMissing && (
        <div>
          <p>SwitchBot credentials are not registered. Please register them.</p>
          <button onClick={handleTokenRegister}>Register Credentials</button>
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {devices.map((device) => (
          <div
            key={device.deviceId}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '10px',
              cursor: 'pointer',
            }}
            onClick={() =>
              router.push(`/control/${device.deviceId}?remoteType=${device.remoteType || ''}`)
            }
          >
            <h3>{device.deviceName}</h3>
            <p>{device.deviceType}{device.remoteType ? ` / ${device.remoteType}` : ''}</p>
          </div>
        ))}
      </div>
    </div>
  );
}