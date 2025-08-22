import { useState } from "react";
import Slide from "@mui/material/Slide";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import FullScreenIcon from "@mui/icons-material/Fullscreen";
import FullScreenExitIcon from "@mui/icons-material/FullscreenExit";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";

export function SmartChatContainer() {
  const [isShowBubble, setIsShowBubble] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const HandleShowBubble = () => {
    setIsShowBubble(!isShowBubble);
  };

  const HandleHideBubble = () => {
    setIsShowBubble(false);
  };

  const HandleToggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  return (
    <div>
      {isShowBubble ? (
        <Fade in={isShowBubble} timeout={500}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(21, 21, 21, 0.4)",
              cursor: "pointer",
            }}
            onClick={HandleHideBubble}
          />
        </Fade>
      ) : null}
      <Slide direction="up" in={isShowBubble} mountOnEnter unmountOnExit>
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            height: "95vh",
            width: isFullScreen ? "95vw" : "400px",
            backgroundColor: "snow",
            zIndex: 1000,
            borderRadius: "6px",
            boxShadow: "0px 2px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          <AppBar
            position="relative"
            color="primary"
            sx={{
              borderTopLeftRadius: "6px",
              borderTopRightRadius: "6px",
              padding: '12px 10px'
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="close"
                  onClick={HandleToggleFullScreen}
                >
                  {isFullScreen ? <FullScreenExitIcon /> : <FullScreenIcon />}
                </IconButton>
              </Box>
              <Typography>ARTEMISA CHAT</Typography>
              <Box>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="close"
                  onClick={HandleHideBubble}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </AppBar>
        </Box>
      </Slide>
      {!isShowBubble ? (
        <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <Fab color="primary" aria-label="add" onClick={HandleShowBubble}>
            <ChatIcon />
          </Fab>
        </Box>
      ) : null}
    </div>
  );
}
