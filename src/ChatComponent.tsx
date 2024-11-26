/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from "react";
import ChatLogs from "./ChatLogs";
import UserNameInput from "./UserNameInput";
import MessageInput from "./MessageInput";
import axios from "axios";
import { containerStyle } from "./css";

const ChatComponent: React.FC = () => {
  const [userNameInput, setUserNameInput] = useState(""); // 해당 컴포넌트와 연결되는 set 인풋을 만들어줌
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [chatLogs, setChatLogs] = useState<string[]>([`{"message":"Welcome to Talkky!"}`]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const checkUserNameDuplicate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/auth/user/${userName}`
        );
        
        const isDuplicate = response.data;
        if (isDuplicate) {
          alert("이미 존재하는 사용자 이름입니다.");
          setUserName("");
        } else {
          wsRef.current = new WebSocket(`ws://localhost:8080/chat`);

          wsRef.current.onopen = () => {
            if (wsRef.current) {
              let date = new Date();
              const utcMiliseconds = date.getTime() + date.getTimezoneOffset() * 60 * 1000;
              wsRef.current.send(`{"time": ${utcMiliseconds},"message":"${userName} has joined!"}`)
            }
          };
          
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
            
            alert("서버와의 연결이 초기화 되었습니다.");
            setUserNameInput("");
            setChatLogs(["Welcome to Talkky!"]);
            setUserName("");
          };
          
        }

        return { userName, isDuplicate };
      } catch (error) {
        console.error("Error checking username duplicate:", error);
        return { userName, isDuplicate: null };
      }
    };

    if (userName.trim() !== "") {
      checkUserNameDuplicate().then(({ userName, isDuplicate }) => console.log(`"${userName}" 중복 확인 결과: ${isDuplicate}`));
    }

    return () => wsRef.current?.close();
  }, [userName]);

  const sendMessage = () => {
    if (
      message.trim() !== "" &&
      userName.trim() !== "" &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      let date = new Date();
      const utcMiliseconds = date.getTime() + date.getTimezoneOffset() * 60 * 1000;

      let payload = JSON.stringify({ time: utcMiliseconds, author: userName, message: message });
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