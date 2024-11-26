/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import ChatLogs from "./ChatLogs";
import UserNameInput from "./UserNameInput";
import MessageInput from "./MessageInput";
import { containerStyle } from "./css";

const ChatComponent: React.FC = () => {
  const [userNameInput, setUserNameInput] = useState(""); // 해당 컴포넌트와 연결되는 set 인풋을 만들어줌
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [chatLogs, setChatLogs] = useState<string[]>([`{"message":"Welcome to Talkky!"}`]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (userName) {
      wsRef.current = new WebSocket(`ws://localhost:8080/chat`);

      wsRef.current.onopen = () => console.log("Connection opened");

      wsRef.current.onmessage = (event) =>
        setChatLogs((prevChatLogs) => [...prevChatLogs, event.data]);

      wsRef.current.onclose = (event) => {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          );
        } else {
          console.log(`[close] Connection died, code=${event.code} reason=${event.reason}`);
        }
      };

      return () => wsRef.current?.close();
    }

    return undefined;
  }, [userName]);

  const sendMessage = () => {
    if (
      message.trim() !== "" &&
      userName.trim() !== "" &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      let payload = JSON.stringify({ author: userName, message: message });
      wsRef.current.send(payload);

      setMessage("");
    }
  };

  return (
    <div css={containerStyle}>
      <h1>Talkky(토키)</h1>
      <ChatLogs logs={chatLogs} />
      {!userName ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userNameInput) {
              setUserName(userNameInput);
            }
          }}
        >
          <UserNameInput
            userNameInput={userNameInput}
            setUserNameInput={setUserNameInput}
            setUserName={setUserName}
          />
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <MessageInput
            message={message}
            setMessage={setMessage}
            sendMessage={(e) => sendMessage()}
          />
        </form>
      )}
    </div>
  );
};

export default ChatComponent;