'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Container, Typography, Box, Button } from '@mui/material';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useSwitchbotApi } from '@/hooks/useSwitchbotApi';
import BotController from '@/components/devices/BotController';
import TVController from '@/components/devices/TVController';
import ACController from '@/components/devices/ACController';

interface DeviceStatus {
  deviceMode?: string;
  deviceType?: string;
  remoteType?: string;
}

export default function DeviceControlPage() {
  const params = useParams();
  const router = useRouter();
  const { deviceId } = params as { deviceId: string };
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const searchParams = useSearchParams();
  const queryRemoteType = searchParams.get('remoteType') || '';
  const { SnackbarComponent } = useSnackbar();
  const { loading, fetchDeviceStatus, sendCommand } = useSwitchbotApi();

  const fetchDeviceData = useCallback(async () => {
    if (!deviceId) return;
    const deviceStatus = await fetchDeviceStatus(deviceId);
    if (deviceStatus) {
      setStatus(deviceStatus);
    }
  }, [deviceId, fetchDeviceStatus]);

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  const handleCommand = async (command: string, param?: string) => {
    await sendCommand(deviceId, command, param);
    // 一部のコマンドでは状態が変わるので再取得
    if (['turnOn', 'turnOff', 'setAll'].includes(command)) {
      setTimeout(() => fetchDeviceData(), 1000);
    }
  };

  if (loading && !status) {
    return <Container><Typography>Loading...</Typography></Container>;
  }
  
  if (!status) {
    return (
      <Container>
        <Typography>Device not found or cannot be accessed</Typography>
        <Button variant="contained" onClick={() => router.push('/control')}>
          Back to Devices
        </Button>
        <SnackbarComponent />
      </Container>
    );
  }

  const effectiveRemoteType = status.remoteType || queryRemoteType;

  return (
    <Container sx={{ py: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => router.push('/control')}>
          ←
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom>
        Device Control: {deviceId}
      </Typography>
      
      {status.deviceType === 'Bot' && (
        <BotController deviceMode={status.deviceMode} onCommand={handleCommand} />
      )}

      {effectiveRemoteType === 'TV' && (
        <TVController onCommand={handleCommand} />
      )}

      {effectiveRemoteType === 'Air Conditioner' && (
        <ACController onCommand={handleCommand} />
      )}

      {!(status.deviceType === 'Bot' || effectiveRemoteType === 'TV' || effectiveRemoteType === 'Air Conditioner') && (
        <Typography>未実装のデバイスタイプです</Typography>
      )}
      
      <SnackbarComponent />
    </Container>
  );
}