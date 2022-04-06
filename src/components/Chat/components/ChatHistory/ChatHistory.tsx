import React from "react";
import { useMessagesContext } from "../../../../hooks/useMessagesContext";
import { Message } from "../../../Message/Message";
import { ChatHistoryHeader } from "../ChatHistoryHeader/ChatHistoryHeader";

import "./ChatHistory.css";

export const ChatHistory = () => {
  const { messages } = useMessagesContext();

  return (
    <div className="history">
      <ChatHistoryHeader />
      <div className="history__content">
        {messages.length ? messages.map((message) => <Message {...message} key={message.id} />) : null}
      </div>
    </div>
  );
};
