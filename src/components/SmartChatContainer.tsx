import { useState } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';

export function SmartChatContainer() {
  const [isShowBubble, setIsShowBubble] = useState(false);

  const HandleShowBubble = () => {
    setIsShowBubble(!isShowBubble);
  }

  return (
    <div>
      {isShowBubble ? (
        <Box sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          height: '300px',
          width: '300px',
          backgroundColor: 'red'
        }}>
          <p>dd</p>
        </Box>
      ) : null}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}>
        <Fab color="primary" aria-label="add" onClick={HandleShowBubble}>
          <ChatIcon />
        </Fab>
      </Box>
    </div>
  );
}
