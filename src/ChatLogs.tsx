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
        if (log?.time) {
          const now = new Date()
          var date = new Date(log.time)
          // date가 UTC기준이니 로컬 시간으로 변환
          date.setMinutes(date.getMinutes() - now.getTimezoneOffset())
          // YYYY-MM-DD HH:MM:SS 형태로 변환
          text += `[${date.toISOString().replace("T", " ").replace("Z", "").slice(0, -4)}] `
        }
        if (log?.author) {
          text += `${log.author} : `
        }
        if (log?.message) {
          text += log.message
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