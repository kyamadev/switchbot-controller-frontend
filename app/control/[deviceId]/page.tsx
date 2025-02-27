'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Paper
} from '@mui/material';

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
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  //クエリ
  const searchParams = useSearchParams();
  const queryRemoteType = searchParams.get('remoteType') || '';
  //エアコン
  const [acTemp, setAcTemp] = useState(26);          // 温度
  const [acMode, setAcMode] = useState(1);           // 1(auto),2(cool),3(dry),4(fan),5(heat)
  const [acFan, setAcFan] = useState(1);            // 1(auto),2(low),3(medium),4(high)
  const [acPower, setAcPower] = useState<'on'|'off'>('off');

  // TV
  const [tvChannel, setTvChannel] = useState(1);

  useEffect(() => {
    if (!deviceId) return;
    const fetchStatus = async () => {
      try {
        const access = Cookies.get('access');
        const res = await axios.get<DeviceStatus>(`${baseURL}/api/control/${deviceId}`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        setStatus(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatus();
  }, [deviceId]);

  const sendCommand = async (command: string, param?: string) => {
    try {
      const access = Cookies.get('access');
      await axios.post(`${baseURL}/api/control/${deviceId}/${command}/`, param ? { param } : {}, {
        headers: { Authorization: `Bearer ${access}` },
      });
      alert("Command sent");
    } catch (error) {
      console.error(error);
      alert("Failed to send command");
    }
  };

  const updateAC = (newTemp: number, newMode: number, newFan: number, newPower: 'on'|'off') => {
    setAcTemp(newTemp);
    setAcMode(newMode);
    setAcFan(newFan);
    setAcPower(newPower);

    const param = `${newTemp},${newMode},${newFan},${newPower}`;
    sendCommand('setAll', param);
  };

  const handlePowerOn = () => {
    updateAC(acTemp, acMode, acFan, 'on');
  };
  const handlePowerOff = () => {
    updateAC(acTemp, acMode, acFan, 'off');
  };

  const handleTempUp = () => {
    if (acTemp < 30 && acPower === 'on') {
      updateAC(acTemp + 1, acMode, acFan, 'on');
    }
  };
  const handleTempDown = () => {
    if (acTemp > 16 && acPower === 'on') {
      updateAC(acTemp - 1, acMode, acFan, 'on');
    }
  };

  const handleModeChange = (value: number) => {
    if (acPower === 'on') {
      updateAC(acTemp, value, acFan, 'on');
    }
  };

  const handleFanChange = (value: number) => {
    if (acPower === 'on') {
      updateAC(acTemp, acMode, value, 'on');
    }
  };

  // TV チャンネル変更
  const handleSetChannel = () => {
    const param = `${tvChannel}`;
    sendCommand('SetChannel', param);
  };
  if (!status) return <Container><Typography>Loading...</Typography></Container>;
  // deviceType が "Bot" 以外のとき remoteType は本来 undefined のことが多い
  // SwitchBotの status API は "remoteType" を返さない場合もあるため、
  // 一覧からクエリで来た "queryRemoteType" と合体して判断
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">Bot UI</Typography>
          {status.deviceMode === 'pressMode' ? (
            <Button variant="contained" onClick={() => sendCommand('press')}>
              Press
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={() => sendCommand('turnOn')}>
                Turn On
              </Button>
              <Button variant="contained" onClick={() => sendCommand('turnOff')}>
                Turn Off
              </Button>
            </Box>
          )}
        </Box>
      )}

      {effectiveRemoteType === 'TV' && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1">TV Remote</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            <Button variant="contained" onClick={() => sendCommand('turnOn')}>
              Power On
            </Button>
            <Button variant="contained" onClick={() => sendCommand('turnOff')}>
              Power Off
            </Button>
            <Button variant="contained" onClick={() => sendCommand('volumeAdd')}>
              Volume +
            </Button>
            <Button variant="contained" onClick={() => sendCommand('volumeSub')}>
              Volume -
            </Button>
            <Button variant="contained" onClick={() => sendCommand('channelAdd')}>
              Channel +
            </Button>
            <Button variant="contained" onClick={() => sendCommand('channelSub')}>
              Channel -
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Channel"
              type="number"
              variant="outlined"
              size="small"
              value={tvChannel}
              onChange={(e) => setTvChannel(Number(e.target.value))}
            />
            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleSetChannel}
            >
              Set Channel
            </Button>
          </Box>
        </Paper>
      )}

{effectiveRemoteType === 'Air Conditioner' && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="body1">Air Conditioner Remote</Typography>

          <Box sx={{ mb: 1 }}>
            <Typography variant="body2">
              Power: {acPower.toUpperCase()}, Mode: {acMode}, Fan: {acFan}, Temp: {acTemp}℃
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              color={acPower === 'on' ? 'secondary' : 'primary'}
              onClick={handlePowerOn}
              disabled={acPower === 'on'}
            >
              Power On
            </Button>
            <Button
              variant="contained"
              color={acPower === 'off' ? 'secondary' : 'primary'}
              onClick={handlePowerOff}
              disabled={acPower === 'off'}
            >
              Power Off
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant="outlined"
              onClick={handleTempDown}
              disabled={acPower === 'off'}
            >
              Temp -
            </Button>
            <Button
              variant="outlined"
              onClick={handleTempUp}
              disabled={acPower === 'off'}
            >
              Temp +
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <Typography variant="body2">Mode:</Typography>
            <Select
              size="small"
              value={acMode}
              onChange={(e) => handleModeChange(Number(e.target.value))}
              disabled={acPower === 'off'}
              sx={{ width: 120 }}
            >
              <MenuItem value={1}>Auto</MenuItem>
              <MenuItem value={2}>Cool</MenuItem>
              <MenuItem value={3}>Dry</MenuItem>
              <MenuItem value={4}>Fan</MenuItem>
              <MenuItem value={5}>Heat</MenuItem>
            </Select>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">Fan Speed:</Typography>
            <Select
              size="small"
              value={acFan}
              onChange={(e) => handleFanChange(Number(e.target.value))}
              disabled={acPower === 'off'}
              sx={{ width: 120 }}
            >
              <MenuItem value={1}>Auto</MenuItem>
              <MenuItem value={2}>Low</MenuItem>
              <MenuItem value={3}>Medium</MenuItem>
              <MenuItem value={4}>High</MenuItem>
            </Select>
          </Box>
        </Paper>
      )}

      {!(status.deviceType === 'Bot' || effectiveRemoteType === 'TV' || effectiveRemoteType === 'Air Conditioner') && (
        <Typography>未実装</Typography>
      )}
    </Container>
  );
}