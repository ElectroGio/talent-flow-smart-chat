import "./App.css";
import { useState, useRef } from "react";
import { SendChatMessageService } from "./services/ChatService";
import {
  MdChatBubble,
  MdSend,
  MdClose,
  MdFullscreen,
  MdFullscreenExit,
  MdChat,
  MdAttachFile
} from "react-icons/md";
import NotificationSound from '../public/notification.mp3';
import { TextField, Button } from '@mui/material';

export default function App() {
  const [isShowBubble, setIsShowBubble] = useState(true);

  const [inputValue, setInputValue] = useState("");

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

  const [currentFile, setCurrentFile] = useState<File | null>(null);

  type Message = {
    message: string;
    sender: "user" | "bot";
    timespan: string;
  };

  const [messages, setMessages] = useState<Message[]>([]);

  function HandleOpenBubble() {
    setIsShowBubble(true);
  }

  function HandleCloseBubble() {
    setIsShowBubble(false);
  }

  async function HandleFormSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    if (inputValue.trim() === "") {
      return;
    }
    setIsLoading(true);
    event.preventDefault();
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: inputValue,
        sender: "user",
        timespan: new Date().toISOString(),
      },
    ]);
    setInputValue("");
    const formData = new FormData();
    formData.append("question", inputValue);
    if (currentFile) {
      formData.append("files", currentFile);
    }
    const response = await SendChatMessageService(formData);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: response.answer,
        sender: "bot",
        timespan: new Date().toISOString(),
      },
    ]);
    notificationSoundRef.current?.play();
    setIsLoading(false);
  }

  function HandleOpenFileUpload() {
    fileInputRef.current?.click();
  }

  function HandleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentFile(file);
    }
  }

  return (
    <>
      {!isShowBubble ? (
        <div className="smart-chat-bubble-container" onClick={HandleOpenBubble}>
          <MdChat className="chat-bubble-icon" />
        </div>
      ) : null}
      {isShowBubble ? (
        <div className="buble-container">
          <div className="bubble-overlay" onClick={HandleCloseBubble} />
          <div
            className={
              isFullScreen
                ? "smart-chat-bubble smart-chat-bubble-full"
                : "smart-chat-bubble smart-chat-bubble-mini "
            }
          >
            <div className="smart-chat-container">
              <div className="smart-chat-bubble-header">
                {isFullScreen ? (
                  <MdFullscreenExit
                    className="smart-chat-header-icon"
                    onClick={() => setIsFullScreen(false)}
                  />
                ) : (
                  <MdFullscreen
                    className="smart-chat-header-icon"
                    onClick={() => setIsFullScreen(true)}
                  />
                )}
                <div className="header-bot-name">
                  <MdChatBubble className="smart-chat-name-header-icon" />
                  <p>ARTEMISA BOT</p>
                </div>
                <MdClose
                  className="smart-chat-header-icon"
                  onClick={HandleCloseBubble}
                />
              </div>
              <div className="smart-chat-body">
                {messages.map((message, index) => {
                  if (message.sender === "bot") {
                    return (
                      <div key={index} className="bot-message">
                        <div className={isFullScreen ? 'message-body-full message-body-bot' : 'message-body-mini message-body-bot'}>
                          <p>{message.message}</p>
                        </div>
                        <div className={isFullScreen ? "message-space-full" : "message-space-mini"} />
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="user-message">
                        <div className={isFullScreen ? "message-space-full" : "message-space-mini"} />
                        <div className={isFullScreen ? 'message-body-full message-body-user' : 'message-body-mini message-body-user'}>
                          <p>{message.message}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="smart-chat-form">
              <div className="smart-chat-form-container">
                <form onSubmit={HandleFormSubmit}>
                  {isLoading ? (
                    <div className="loader" />
                  ) : null}
                  <TextField
                    variant="filled"
                    fullWidth
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="smart-chat-form-actions">
                    <Button type="submit" variant="outlined" color="primary" onClick={HandleOpenFileUpload}>
                      <MdAttachFile className="smart-chat-send-icon" />
                      Attach
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      <MdSend className="smart-chat-send-icon" />
                      Send
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <audio src={NotificationSound} ref={notificationSoundRef} preload="auto" />
      <input type="file" className="smart-chat-file-input" ref={fileInputRef} onChange={HandleFileChange} />
    </>
  );
}
