'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Grid
} from '@mui/material';
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
  }, [baseURL]);

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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Device Control
      </Typography>

      {credentialMissing && (
        <div>
          <Typography color="error" sx={{ mb: 2 }}>
            SwitchBot credentials are not registered.
          </Typography>
          <Button variant="contained" onClick={handleTokenRegister}>
            Register Token & Secret
          </Button>
        </div>
      )}

      {!credentialMissing && (
      <Button variant="contained" onClick={handleTokenRegister}>
        Update Token & Secret
      </Button>
      )}

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.deviceId}>
            <Card>
              <CardActionArea
                onClick={() =>
                  router.push(`/control/${device.deviceId}?remoteType=${device.remoteType || ''}`)
                }
              >
                <CardContent>
                  <Typography variant="h6">{device.deviceName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {device.deviceType}
                    {device.remoteType && ` / ${device.remoteType}`}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}