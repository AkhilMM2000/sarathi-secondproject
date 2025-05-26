import React, { RefObject } from "react";
import {
  Box,
  Typography,
  Paper,
  Fab,
  Zoom,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Fullscreen,
  MoreVert,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const VideoContainer = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: '#000',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 50,
}));

const RemoteVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const LocalVideoContainer = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  width: 160,
  height: 120,
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  border: `3px solid ${theme.palette.common.white}`,
  boxShadow: theme.shadows[10],
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[15],
  },
  [theme.breakpoints.down('sm')]: {
    width: 120,
    height: 90,
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

const LocalVideo = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)',
  padding: theme.spacing(4, 3, 3),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3, 2, 2),
    gap: theme.spacing(2),
  },
}));

const CallerInfoContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(15px)',
  borderRadius: theme.spacing(4),
  padding: theme.spacing(1.5, 2.5),
  border: '1px solid rgba(255,255,255,0.1)',
  [theme.breakpoints.down('sm')]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
    gap: theme.spacing(1),
    padding: theme.spacing(1, 2),
  },
}));

const TopControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: 200, // Offset for local video
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    right: 140,
    top: theme.spacing(1),
  },
}));

type Props = {
  localStreamRef: RefObject<HTMLVideoElement | null>;
  remoteStreamRef: RefObject<HTMLVideoElement | null>;
  callerName?: string;
  onEndCall: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  isMicOn: boolean;
  isCameraOn: boolean;
};

const VideoCallScreen: React.FC<Props> = ({
  localStreamRef,
  remoteStreamRef,
  callerName = "Unknown Caller",
  onEndCall,
  onToggleMic,
  onToggleCamera,
  isMicOn,
  isCameraOn,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCallerInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <VideoContainer>
      {/* Remote Video */}
      <RemoteVideo
        ref={remoteStreamRef}
        autoPlay
        playsInline
      />

      {/* Caller Information */}
      <CallerInfoContainer>
        <Avatar 
          sx={{ 
            width: isMobile ? 28 : 36, 
            height: isMobile ? 28 : 36,
            bgcolor: theme.palette.primary.main,
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            fontWeight: 600,
          }}
        >
          {getCallerInitials(callerName)}
        </Avatar>
        <Box>
          <Typography 
            variant={isMobile ? "body2" : "subtitle1"}
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {callerName}
          </Typography>
          <Chip
            label="Connected"
            size="small"
            sx={{
              bgcolor: 'rgba(76, 175, 80, 0.2)',
              color: '#4caf50',
              fontSize: '0.7rem',
              height: isMobile ? 18 : 20,
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      </CallerInfoContainer>

      {/* Top Controls */}
      <TopControls>
        <Tooltip title="More options" arrow>
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <MoreVert fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Fullscreen" arrow>
          <IconButton
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Fullscreen fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
        </Tooltip>
      </TopControls>

      {/* Local Video */}
      <LocalVideoContainer elevation={12}>
        <LocalVideo
          ref={localStreamRef}
          autoPlay
          playsInline
          muted
          id="local-video"
        />
        {!isCameraOn && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.grey[700],
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
              }}
            >
              <VideocamOff fontSize={isMobile ? "small" : "medium"} />
            </Avatar>
          </Box>
        )}
      </LocalVideoContainer>

      {/* Controls */}
      <ControlsContainer>
        <Zoom in={true}>
          <Tooltip title={isMicOn ? "Mute microphone" : "Unmute microphone"} arrow>
            <Fab
              onClick={onToggleMic}
              size={isMobile ? "medium" : "large"}
              sx={{
                bgcolor: isMicOn ? 'rgba(255,255,255,0.15)' : theme.palette.error.main,
                color: 'white',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: isMicOn ? 'rgba(255,255,255,0.25)' : theme.palette.error.dark,
                  transform: 'scale(1.1)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: theme.shadows[6],
              }}
            >
              {isMicOn ? <Mic /> : <MicOff />}
            </Fab>
          </Tooltip>
        </Zoom>

        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Tooltip title={isCameraOn ? "Turn off camera" : "Turn on camera"} arrow>
            <Fab
              onClick={onToggleCamera}
              size={isMobile ? "medium" : "large"}
              sx={{
                bgcolor: isCameraOn ? 'rgba(255,255,255,0.15)' : theme.palette.error.main,
                color: 'white',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': {
                  bgcolor: isCameraOn ? 'rgba(255,255,255,0.25)' : theme.palette.error.dark,
                  transform: 'scale(1.1)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: theme.shadows[6],
              }}
            >
              {isCameraOn ? <Videocam /> : <VideocamOff />}
            </Fab>
          </Tooltip>
        </Zoom>

        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Tooltip title="End call" arrow>
            <Fab
              onClick={onEndCall}
              size={isMobile ? "medium" : "large"}
              sx={{
                bgcolor: theme.palette.error.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.error.dark,
                  transform: 'scale(1.1)',
                  boxShadow: theme.shadows[10],
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: theme.shadows[8],
              }}
            >
              <CallEnd />
            </Fab>
          </Tooltip>
        </Zoom>
      </ControlsContainer>
    </VideoContainer>
  );
};

export default VideoCallScreen;