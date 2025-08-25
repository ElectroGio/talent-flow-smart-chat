import { useState, useRef } from "react";
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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import NotificationAudio from "../../public/notification.mp3";
import { SendChatMessageService } from '../services/ChatService';

export function SmartChatContainer() {
  const [currentMessage, setCurrentMessage] = useState("");

  const [isShowBubble, setIsShowBubble] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I assist you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString(),
    },
    {
      id: 2,
      text: "I have a question about my order.",
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const HandleShowBubble = () => {
    setIsShowBubble(!isShowBubble);
  };

  const HandleHideBubble = () => {
    setIsShowBubble(false);
  };

  const HandleToggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const HandleFormSubmit = async (event: Event) => {
    event.preventDefault();
    if (currentMessage.trim() === "") {
      return;
    }
    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: currentMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setCurrentMessage("");
    const fm = new FormData();
    fm.append('question', currentMessage);
    const response = await SendChatMessageService(fm);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        text: response.answer,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    audioRef.current?.play();
    setIsLoading(false);
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
              padding: "12px 10px",
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
          <Box
            sx={{ height: "calc(100% - 64px)", borderRadius: "0 0 6px 6px" }}
          >
            <Box
              sx={{
                height: "80%",
                overflowY: "auto",
                paddingLeft: "20px",
                paddingRight: "20px",
              }}
            >
              {messages.map((message, index) => {
                if (message.sender === "user") {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      <Box sx={{ width: "30%" }} />
                      <Box
                        sx={{
                          backgroundColor: "#2E7D32",
                          width: "70%",
                          borderRadius: "6px",
                          padding: "10px 10px 0px 10px",
                        }}
                      >
                        <Typography sx={{ color: "snow" }}>
                          {message.text}
                        </Typography>
                        <Typography
                          sx={{
                            color: "snow",
                            marginTop: "4px",
                            marginBottom: "4px",
                            fontSize: "0.7em",
                            fontStyle: "italic",
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  );
                } else {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        marginTop: "15px",
                        marginBottom: "15px",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#424242",
                          width: "70%",
                          borderRadius: "6px",
                          padding: "10px 10px 0px 10px",
                        }}
                      >
                        <Typography sx={{ color: "snow" }}>
                          {message.text}
                        </Typography>
                        <Typography
                          sx={{
                            color: "snow",
                            marginTop: "4px",
                            marginBottom: "4px",
                            fontSize: "0.7em",
                            fontStyle: "italic",
                          }}
                        >
                          {message.timestamp}
                        </Typography>
                      </Box>
                      <Box sx={{ width: "30%" }} />
                    </Box>
                  );
                }
              })}
            </Box>
            <form onSubmit={HandleFormSubmit}>
              <Box
                sx={{
                  height: "20%",
                  padding: "0px 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                }}
              >
                {isLoading ? (
                  <Box>
                    <div className="loader" />
                  </Box>

                ) : null}
                <TextField
                  label="Type your message"
                  variant="outlined"
                  fullWidth
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "15px",
                    marginBottom: "15px",
                  }}
                >
                  <Button variant="outlined" color="primary">
                    <AttachFileIcon sx={{ marginRight: "8px" }} />
                    Attach
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                  >
                    <SendIcon sx={{ marginRight: "8px" }} />
                    Send
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Slide>
      {!isShowBubble ? (
        <Box sx={{ position: "fixed", bottom: 16, right: 16 }}>
          <Fab color="primary" aria-label="add" onClick={HandleShowBubble}>
            <ChatIcon />
          </Fab>
        </Box>
      ) : null}
      <audio id="notification-audio" src={NotificationAudio} preload="auto" ref={audioRef} />
    </div>
  );
}
