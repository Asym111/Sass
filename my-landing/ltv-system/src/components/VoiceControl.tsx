import React, { useRef, useState } from 'react';
import { IconButton, Tooltip, Paper, Typography, Fade } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import StopIcon from '@mui/icons-material/Stop';

const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceControl: React.FC<{ onCommand: (command: string) => void }> = ({ onCommand }) => {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    if (!SpeechRecognition) {
      alert('Ваш браузер не поддерживает голосовое управление');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setTranscript(text);
      if (event.results[0].isFinal) {
        setListening(false);
        onCommand(text);
        setTimeout(() => setTranscript(''), 1200);
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', marginLeft: 12 }}>
      <Tooltip title={listening ? 'Говорите...' : 'Голосовое управление'}>
        <span>
          <IconButton color={listening ? 'error' : 'primary'} onClick={listening ? stopListening : startListening}>
            {listening ? <StopIcon /> : <KeyboardVoiceIcon />}
          </IconButton>
        </span>
      </Tooltip>
      <Fade in={!!transcript}>
        <Paper elevation={6} sx={{ position: 'absolute', top: 48, left: 0, px: 2, py: 1, zIndex: 2000, minWidth: 180 }}>
          <Typography variant="body2" color="primary" fontWeight={700}>{transcript}</Typography>
        </Paper>
      </Fade>
    </div>
  );
};

export default VoiceControl;
