/** @jsxImportSource @emotion/react */
import React from "react";
import {divStyle, inputStyle, buttonStyle} from "./css";


const MessageInput: React.FC<{
  message: string;
  setMessage: (value: string) => void;
  sendMessage: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ message, setMessage, sendMessage }) => {
  return (
    <div css={divStyle}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="보내실 메시지를 입력하세요."
        css={inputStyle}
      />
      <button onClick={sendMessage} css={buttonStyle}>
        보내기
      </button>
    </div>
  );
};

export default MessageInput;