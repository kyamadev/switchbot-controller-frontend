import { useState } from 'react';
import { Button, Box, Typography, Paper, Select, MenuItem } from '@mui/material';

interface ACControllerProps {
  onCommand: (command: string, param?: string) => Promise<void>;
}

export default function ACController({ onCommand }: ACControllerProps) {
  const [acTemp, setAcTemp] = useState(26);
  const [acMode, setAcMode] = useState(1);
  const [acFan, setAcFan] = useState(1);
  const [acPower, setAcPower] = useState<'on'|'off'>('off');

  const updateAC = (newTemp: number, newMode: number, newFan: number, newPower: 'on'|'off') => {
    setAcTemp(newTemp);
    setAcMode(newMode);
    setAcFan(newFan);
    setAcPower(newPower);

    const param = `${newTemp},${newMode},${newFan},${newPower}`;
    onCommand('setAll', param);
  };

  const handlePowerOn = () => updateAC(acTemp, acMode, acFan, 'on');
  const handlePowerOff = () => updateAC(acTemp, acMode, acFan, 'off');
  
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

  return (
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
  );
}