import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
  Paper,
  Badge,
 Fade, 
 Popover,
 List,
 ListItem,
 ListItemIcon,
 ListItemText,
 ListItemButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PersonIcon from '@mui/icons-material/Person';
import moment from 'moment';
import { CreatesocketConnection } from '../constant/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../store/ReduxStore';
import { DriverAPI, UserAPI } from '../Api/AxiosInterceptor';
import useFetchChatUserData from '../hooks/useFetchChatUserData';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import EmojiPicker,{ EmojiClickData }  from 'emoji-picker-react';
import ApiService from '../Api/ApiService';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
  senderType: 'user' | 'driver';
  roomId: string | null;
  recieverId: string
}

interface Message {
  _id?: string;
  senderId: string;
  senderRole: 'User' | 'Driver';
   type: 'text'|'image' | 'pdf' | 'doc' 
  text?: string;
  fileUrl?: string;
  createdAt: string;
}


const socket = CreatesocketConnection();

const ChatModal: React.FC<ChatModalProps> = ({ open, onClose, senderType, roomId,recieverId }) => {
  //emojis setup
  const [isMobile, setIsMobile] = useState(false);
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { userData, apiError, loading } = useFetchChatUserData(senderType, recieverId);
  const [receiverStatus, setReceiverStatus] = useState<{ onlineStatus: string; lastSeen: string } | null>(null);
  const inputRef = useRef(null);
  const currentUser = useSelector((state: RootState) =>
    senderType === 'user' ? state.authUser.user : state.driverStore.driver
  );
//delete message popover and delete message functionality
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
 const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);


const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, messageId: string) => {
  setAnchorEl(event.currentTarget);
  setSelectedMessageId(messageId);
};

const handlePopoverClose = () => {
  setAnchorEl(null);
  setSelectedMessageId(null);
};
const handleDelete = async () => {
  if (!selectedMessageId) return;

  try {
    if(senderType === 'user'){
      await UserAPI.delete(`/chat/${roomId}/message/${selectedMessageId}`);
   
  } else if(senderType === 'driver'){
      await DriverAPI.delete(`/chat/${roomId}/message/${selectedMessageId}`);
    
    
  }
  setMessages((prev) => prev.filter((msg) => msg._id !== selectedMessageId));
    socket.emit('messageDeleted', { messageId: selectedMessageId,roomId });

  } catch (error) {
    console.error('Delete error:', error);
  } finally {
    handlePopoverClose();
  }
};
const openPop = Boolean(anchorEl);


  useEffect(() => {
    if (!recieverId) return;

    const handleUserStatusUpdate = (data: { userId: string; onlineStatus: string; lastSeen: string }) => {
      if (data.userId === recieverId) {
        setReceiverStatus({
          onlineStatus: data.onlineStatus,
          lastSeen: data.lastSeen,
        });
      }
    };

    socket.on('userStatusUpdate', handleUserStatusUpdate);

    return () => {
      socket.off('userStatusUpdate', handleUserStatusUpdate);
    };
  }, [recieverId]);
  useEffect(() => {
    if (!roomId || !currentUser?._id) return;
    const fetchMessages = async () => {
      try {
    if(senderType=='user'){ 
        const response = await UserAPI.get(`/chat/${roomId}`);
        console.log(response.data,'your chat reach here');
        setMessages(response.data);
    }else if(senderType=='driver'){
        const response = await DriverAPI.get(`/chat/${roomId}`); 
        setMessages(response.data);
    }
     
       
      } catch (error) {
        setError('Failed to load previous messages');
      }
    };
  
    setMessages([]); // reset chat history before loading
    fetchMessages(); 
  

    socket.emit('joinChat', { bookingId: roomId, userId: currentUser._id, userType: senderType  });

    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleError = ({ error }: { error: string }) => {
      setError(error || 'Unknown error occurred.');
    };
const deleteMessage = (messageId: string) => {
  setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
};
socket.on('messageDeleted',deleteMessage
 );
    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageError', handleError);

    return () => {
      socket.emit('leaveChat', { bookingId: roomId, userId: currentUser._id,userType: senderType });

   socket.off('messageDeleted', deleteMessage);
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageError', handleError);
    };
  }, [roomId, currentUser]);

//file and image sending option in chat
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // ✅ Validate file size
  const maxSizeMB = 5;
  if (file.size > maxSizeMB * 1024 * 1024) {
    alert('File size exceeds 5MB limit.');
    return;
  }

  // ✅ Validate and map file type
  const mimeType = file.type;
  let simplifiedType: 'image' | 'pdf' | 'doc' | null = null;


  if (mimeType.startsWith('image/')) {
    simplifiedType = 'image';
  } else if (mimeType === 'application/pdf') {
    simplifiedType = 'pdf';
  } else if (
    mimeType === 'application/msword' ||
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    simplifiedType = 'doc';
  }

  if (!simplifiedType) {
    alert('Only images, PDFs, and Word documents are allowed.');
    return;
  }
console.log(simplifiedType,'this is your current file type')
  try {
    // 🟡 Upload to Cloudinary
    const imageSignedUrl = await ApiService.chatSignedUrls(senderType, simplifiedType);
    
    const uploadImage = await ApiService.uploadFileInChat(file, imageSignedUrl);

    // 🟢 Emit via socket and update UI
    const timestamp = new Date().toISOString();
    const fileMessage: Message = {
      senderId: currentUser?._id || '',
      senderRole: senderType === 'user' ? 'User' : 'Driver',
      type: simplifiedType,
      fileUrl: uploadImage,
      createdAt: timestamp,
    };

    socket.emit('sendMessage', {
      bookingId: roomId,
      senderId: currentUser?._id,
      senderRole: fileMessage.senderRole,
      type:simplifiedType,
      fileUrl:uploadImage,
    });

    
  } catch (err) {
   
    alert('Failed to send file');
  }

  // Reset the input so user can reselect same file
  e.target.value = '';
};



  useEffect(() => {
    // Auto-scroll to the bottom when a new message comes
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);
console.log(userData,'userData')

  const handleSend = () => {
    if (!message.trim() || !roomId || !currentUser?._id) return;
console.log(senderType, roomId, message.trim(), currentUser._id);
    socket.emit('sendMessage', {
      bookingId: roomId,
      type:'text',
      text: message.trim(),
      senderId: currentUser._id,
      senderRole: senderType === 'user' ? 'User' : 'Driver',
    });

    setMessage('');
    setShowEmojiPicker(false);
  };
  const finalOnlineStatus = receiverStatus?.onlineStatus || userData?.onlineStatus;
  const finalLastSeen = receiverStatus?.lastSeen || userData?.lastSeen;
//emoji setup 
useEffect(() => {
  function handleClickOutside(event: MouseEvent): void {
    if (
      emojiPickerRef.current && 
      event.target instanceof Node && 
      !emojiPickerRef.current.contains(event.target)
    ) {
      setShowEmojiPicker(false);
    }
  }
  
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);
const onEmojiClick = (emojiObject:EmojiClickData) => {
  setMessage(prevMessage => prevMessage + emojiObject.emoji);
};

//last seen format
  const formatLastSeen = (datetime: moment.MomentInput) => {
    const now = moment();
    const lastSeen = moment(datetime);
    const diffDays = now.diff(lastSeen, 'days');
    
    if (diffDays === 0) {
      return `Today at ${lastSeen.format('h:mm A')}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${lastSeen.format('h:mm A')}`;
    } else if (diffDays < 7) {
      return `${lastSeen.format('dddd')} at ${lastSeen.format('h:mm A')}`;
    } else {
      return lastSeen.format('MMM D, h:mm A');
    }
  };

  const themeColors = {
    user: {
      primary: '#3f51b5', // Blue for user
      light: '#e8eaf6',
      icon: <PersonIcon fontSize="small" />
    },
    driver: {
      primary: '#2e7d32', // Green for driver
      light: '#e8f5e9',
      icon: <DriveEtaIcon fontSize="small" />
    }
  };

  // Current theme based on sender type
  const currentTheme = senderType === 'user' ? themeColors.user : themeColors.driver;

  
  // Detect if screen is mobile width
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 600);
    };
    
    // Check on mount
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  if (loading) return <div>Loading...</div>;
  if (apiError) return <div>Error: {apiError}</div>;
 
  return (
    <> 
      <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          height: { xs: '100%', sm: '80vh' },
          maxHeight: { xs: '100%', sm: '80vh' },
          m: { xs: 0, sm: 2 },
          overflow: 'hidden',
          borderTop: `4px solid ${currentTheme.primary}`
        } 
      }}
      TransitionComponent={Fade}
      transitionDuration={400}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color={finalOnlineStatus === 'online' ? 'success' : 'default'}
          >
            <Avatar
              src={`${import.meta.env.VITE_IMAGEURL}/${userData?.profile}`}
              alt={userData?.name || 'User'}
              sx={{ 
                width: 48, 
                height: 48,
                border: `2px solid ${currentTheme.primary}`,
                borderColor: 'background.paper',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}
            />
          </Badge>
          <Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="600">
                {userData?.name || `${senderType === 'user' ? 'User' : 'Driver'}`}
              </Typography>
              <Box 
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: currentTheme.light,
                  color: currentTheme.primary,
                  borderRadius: 5,
                  px: 1,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 'medium'
                }}
              >
                {currentTheme.icon}
                <Typography variant="caption" fontWeight="600" sx={{ ml: 0.5 }}>
                  {senderType === 'user' ? 'User' : 'Driver'}
                </Typography>
              </Box>
            </Box>
            {finalOnlineStatus === 'online' ? (
              <Typography variant="caption" color="success.main" fontWeight="500">
                Online now
              </Typography>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Last seen: {formatLastSeen(finalLastSeen)}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Tooltip title="Close">
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{ 
              bgcolor: 'grey.100',
              '&:hover': { bgcolor: 'grey.200' },
              transition: 'background-color 0.3s'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <Divider />

      {/* Messages Container */}
      <DialogContent
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          bgcolor: senderType === 'user' ? 'rgba(63, 81, 181, 0.03)' : 'rgba(46, 125, 50, 0.03)' // Very light background tint
        }}
      >
        {/* Messages List */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            p: 3,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '8px',
            }
          }}
        >
          {messages.length === 0 ? (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="100%"
              flexGrow={1}
              flexDirection="column"
              gap={2}
            >
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${currentTheme.light}`,
                  color: currentTheme.primary,
                  mb: 2
                }}
              >
                {senderType === 'user' ? 
                  <PersonIcon sx={{ fontSize: 40 }} /> : 
                  <DriveEtaIcon sx={{ fontSize: 40 }} />
                }
              </Box>
              <Typography color="text.secondary" variant="body1" fontWeight={500}>
                No messages yet
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Start the conversation with this {senderType === 'user' ? 'user' : 'driver'}!
              </Typography>
            </Box>
          ) : (
            messages.map((msg, index) => {
              const isCurrentUser = msg.senderId.toString() === currentUser?._id.toString();
              const isConsecutive = index > 0 && 
                messages[index - 1].senderId.toString() === msg.senderId.toString();
              
              // Determine the sender color based on sender type
              const msgSenderType = msg.senderRole || (isCurrentUser ? senderType : (senderType === 'user' ? 'driver' : 'user'));
              const msgColor = msgSenderType === 'User' ? themeColors.user.primary : themeColors.driver.primary;
              
              return (
                <Box
                 onMouseEnter={() => setHoveredMsgId(msg._id || null)}
  onMouseLeave={() => setHoveredMsgId(null)}
                  key={index}
                  alignSelf={isCurrentUser ? 'flex-end' : 'flex-start'}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: { xs: '80%', sm: '65%' },
                    mt: isConsecutive ? 0.5 : 2
                  }}
                >
                  {!isConsecutive && !isCurrentUser && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ ml: 1, mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      {msgSenderType === 'User' ? themeColors.user.icon : themeColors.driver.icon}
                      {userData?.name || (msgSenderType === 'User' ? 'User' : 'Driver')}
                    </Typography>
                  )}
                  {hoveredMsgId === msg._id && (<Box sx={{ alignSelf: 'flex-end', mt: 0.5 }}>
  <IconButton
    size="small"
    onClick={(e) => handlePopoverOpen(e, msg._id!)}
    sx={{ p: 0.5 }}
  >
    <MoreVertIcon fontSize="small" />
  </IconButton>
</Box>)}

                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: isCurrentUser ? msgColor : 'white',
                      color: isCurrentUser ? 'white' : 'text.primary',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      borderTopRightRadius: isCurrentUser && !isConsecutive ? 4 : 16,
                      borderTopLeftRadius: !isCurrentUser && !isConsecutive ? 4 : 16,
                      borderBottomRightRadius: isCurrentUser ? 4 : 16,
                      borderBottomLeftRadius: !isCurrentUser ? 4 : 16,
                      borderLeft: !isCurrentUser ? `3px solid ${msgColor}` : 'none',
                      borderRight: isCurrentUser ? 'none' : 'none'
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {msg.text}
                     {msg.type === 'image' && msg.fileUrl && (
    <Box
      component="img"
      src={msg.fileUrl}
      alt="Image"
      sx={{
        maxWidth: '100%',
        borderRadius: 2,
        objectFit: 'cover',
        cursor: 'pointer',
      }}
      onClick={() => window.open(msg.fileUrl, '_blank')}
    />
  )}
{(msg.type === 'pdf' || msg.type === 'doc') && msg.fileUrl && (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      cursor: 'pointer',
      '&:hover': { textDecoration: 'underline' },
    }}
    onClick={() => window.open(msg.fileUrl, '_blank')}
  >
    {msg.type === 'pdf' ? (
      <PictureAsPdfIcon sx={{ color: isCurrentUser ? 'white' : 'error.main' }} />
    ) : (
      <DescriptionIcon sx={{ color: isCurrentUser ? 'white' : 'primary.main' }} />
    )}

    <Typography variant="body2" sx={{ color: isCurrentUser ? 'white' : 'text.primary' }}>
      {decodeURIComponent(msg.fileUrl.split('/').pop() || '')}
    </Typography>
  </Box>
)}


                    </Typography>
                  </Paper>
                  
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      mx: 1,
                      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                      color: 'text.secondary',
                      opacity: 0.8,
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    {moment(msg.createdAt).format('h:mm A')}
                  </Typography>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          {showEmojiPicker && (
            <Box
            ref={emojiPickerRef}
            position="absolute"
            bottom={isMobile ? 0 : "100%"}
            left={isMobile ? 0 : "auto"}
            right={isMobile ? 0 : 16}
            mb={isMobile ? 0 : 1}
            zIndex={1000}
            boxShadow={3}
            borderRadius={isMobile ? "8px 8px 0 0" : 2}
            overflow="hidden"
            bgcolor="background.paper"
            width={isMobile ? "100%" : "auto"}
          >
            <EmojiPicker 
              onEmojiClick={onEmojiClick} 
              height={isMobile ? 300 : 350} 
              width={isMobile ? "100%" : 320} 
            />
          </Box>
          )}
          
          <TextField
            inputRef={inputRef}
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                px: 2,
                py: 1,
                bgcolor: 'grey.50',
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${currentTheme.primary}30`,
                },
                '& fieldset': {
                  borderWidth: '1px',
                  borderColor: 'divider',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Attach file">
  <IconButton
    component="label"
    size="small"
    sx={{
      mr: 1,
      color: 'text.secondary',
      '&:hover': { color: currentTheme.primary },
    }}
  >
    <AttachFileIcon fontSize="small" />
   
    <input
  type="file"
  hidden
  onChange={handleFileChange}
  accept="image/*,.pdf,.doc,.docx"
/>

  </IconButton>
</Tooltip>

                  <Tooltip title="Add emoji">
                    <IconButton 
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      size="small"
                      sx={{ 
                        mr: 1,
                        color: 'text.secondary',
                        '&:hover': { color: currentTheme.primary }
                      }}
                    >
                      <EmojiEmotionsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Send">
                    <span>
                      <IconButton
                        onClick={handleSend}
                        disabled={!message.trim()}
                        sx={{
                          bgcolor: message.trim() ? currentTheme.primary : 'grey.200',
                          color: message.trim() ? 'white' : 'text.disabled',
                          '&:hover': {
                            bgcolor: message.trim() 
                              ? (currentTheme.primary === themeColors.user.primary ? '#303f9f' : '#1b5e20') 
                              : 'grey.200',
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <SendIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          

        </Box>
      </DialogContent>
    </Dialog>
<Popover
  open={openPop}
  anchorEl={anchorEl}
  onClose={handlePopoverClose}
  anchorOrigin={{
    vertical: 'center',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'center',
    horizontal: 'right',
  }}
>
  <List dense>
    <ListItem disablePadding>
      <ListItemButton onClick={handleDelete}>
        <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
        <ListItemText primary="Delete" />
      </ListItemButton>
    </ListItem>
  </List>
</Popover>
      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatModal;
