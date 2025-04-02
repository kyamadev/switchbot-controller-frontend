import { Button, Box, Typography } from '@mui/material';

interface BotControllerProps {
  deviceMode?: string;
  onCommand: (command: string) => Promise<void>;
}

export default function BotController({ deviceMode, onCommand }: BotControllerProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body1">Bot UI</Typography>
      {deviceMode === 'pressMode' ? (
        <Button variant="contained" onClick={() => onCommand('press')}>
          Press
        </Button>
      ) : (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={() => onCommand('turnOn')}>
            Turn On
          </Button>
          <Button variant="contained" onClick={() => onCommand('turnOff')}>
            Turn Off
          </Button>
        </Box>
      )}
    </Box>
  );
}