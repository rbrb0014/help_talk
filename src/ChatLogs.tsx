/** @jsxImportSource @emotion/react */
import React from "react";
import { chatBoxStyle, messageStyle } from "./css";


const ChatLogs: React.FC<{ logs: string[] }> = ({ logs }) => {
  return (
    <div css={chatBoxStyle}>
      {logs.map((logStr, i) => {
        const log = JSON.parse(logStr);

        // 출력할 메세지 형태 설정
        var text = ""
        if (log.author) {
          text = `${log.author} : ${log.message}`
        }
        else {
          text = `${log.message}`
        }

        return (
          <p key={`msg_${i}`} css={messageStyle}>
            {text}
          </p>
        );
      })}
    </div>
  );
};

export default ChatLogs;