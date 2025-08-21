import "./App.css";
import { useState } from "react";
import { SendChatMessageService } from './services/ChatService'

export default function App() {
  const [isShowBubble, setIsShowBubble] = useState(true);

  const [inputValue, setInputValue] = useState("");

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

  async function HandleFormSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
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
  }

  return (
    <>
      {!isShowBubble ? (
        <div
          className="smart-chat-bubble-container"
          onClick={HandleOpenBubble}
        />
      ) : null}
      {isShowBubble ? (
        <div className="buble-container">
          <div className="bubble-overlay" onClick={HandleCloseBubble} />
          <div className="smart-chat-bubble">
            <div className="smart-chat-container">
              <div className="smart-chat-bubble-header">
                <p>Smart Chat</p>
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
                  <input
                    type="text"
                    className="smart-chat-message-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button type="submit" className="smart-chat-submit-button">
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
