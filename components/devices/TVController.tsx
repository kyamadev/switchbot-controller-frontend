import { Button, Box, Typography, Paper } from '@mui/material';

interface TVControllerProps {
  onCommand: (command: string) => Promise<void>;
}

export default function TVController({ onCommand }: TVControllerProps) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="body1">TV Remote</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
        <Button variant="contained" onClick={() => onCommand('turnOn')}>
          Power On
        </Button>
        <Button variant="contained" onClick={() => onCommand('turnOff')}>
          Power Off
        </Button>
        <Button variant="contained" onClick={() => onCommand('volumeAdd')}>
          Volume +
        </Button>
        <Button variant="contained" onClick={() => onCommand('volumeSub')}>
          Volume -
        </Button>
        <Button variant="contained" onClick={() => onCommand('channelAdd')}>
          Channel +
        </Button>
        <Button variant="contained" onClick={() => onCommand('channelSub')}>
          Channel -
        </Button>
      </Box>
    </Paper>
  );
}