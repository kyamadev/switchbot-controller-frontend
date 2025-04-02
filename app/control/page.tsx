'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import { useSwitchbotApi } from '@/hooks/useSwitchbotApi';
import { useSnackbar } from '@/hooks/useSnackbar';

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
  const { loading, fetchDevices } = useSwitchbotApi();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const devicesData = await fetchDevices();
    
    if (!devicesData) {
      setCredentialMissing(true);
      return;
    }
    
    setDevices(devicesData);
    
    if (devicesData.length === 0) {
      showSnackbar('No devices found. Make sure your SwitchBot account has devices set up.', 'info');
    }
  };

  const handleTokenRegister = async () => {
    const token = prompt("Enter your SwitchBot token:");
    const secret = prompt("Enter your SwitchBot secret:");
    
    if (!token || !secret) {
      showSnackbar('Token and secret are required', 'error');
      return;
    }
    
    try {
      // API呼び出しなど
      showSnackbar("SwitchBot credentials registered successfully", 'success');
      setCredentialMissing(false);
      loadDevices();
    } catch (error) {
      showSnackbar("Failed to register credentials", 'error');
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Device Control
      </Typography>

      {credentialMissing ? (
        <Box sx={{ mb: 4 }}>
          <Typography color="error" sx={{ mb: 2 }}>
            SwitchBot credentials are not registered.
          </Typography>
          <Button variant="contained" onClick={handleTokenRegister}>
            Register Token & Secret
          </Button>
        </Box>
      ) : (
        <Box sx={{ mb: 4 }}>
          <Button variant="contained" onClick={handleTokenRegister}>
            Update Token & Secret
          </Button>
        </Box>
      )}

      {loading && devices.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
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
      )}
      
      <SnackbarComponent />
    </Container>
  );
}