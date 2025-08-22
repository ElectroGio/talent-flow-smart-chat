import "./App.css";
import { useState } from "react";
import { SendChatMessageService } from "./services/ChatService";
import {
  MdChatBubble,
  MdSend,
  MdClose,
  MdFullscreen,
  MdFullscreenExit,
  MdChat,
} from "react-icons/md";

export default function App() {
  const [isShowBubble, setIsShowBubble] = useState(true);

  const [inputValue, setInputValue] = useState("");

  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

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
    const response = await SendChatMessageService(formData);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        message: response.answer,
        sender: "bot",
        timespan: new Date().toISOString(),
      },
    ]);
    setIsLoading(false);
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
                        <div className="message-body message-body-bot">
                          <p>{message.message}</p>
                        </div>
                        <div className="message-space" />
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="user-message">
                        <div className="message-space" />
                        <div className="message-body message-body-user">
                          <p>{message.message}</p>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
            <div className="smart-chat-form">
              <form onSubmit={HandleFormSubmit}>
                <div className="smart-chat-form-container">
                  {isLoading ? (
                    <div>
                      <div className="loader" />
                    </div>
                  ) : null}
                  <input
                    type="text"
                    className="smart-chat-message-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button type="submit" className="smart-chat-submit-button">
                    <MdSend className="smart-chat-send-icon" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
