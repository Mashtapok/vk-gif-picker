import React, { useEffect, useMemo, useRef } from "react";
import { IMessage, useMessagesContext } from "../../../../hooks/useMessagesContext";
import { ChatHistoryHeader } from "../ChatHistoryHeader/ChatHistoryHeader";
import { MessageGroup } from "../../../MessageGroup/MessageGroup";

import "./ChatHistory.css";

interface Stacks {
  [key: string]: IMessage[];
}

export const ChatHistory = () => {
  const { messages } = useMessagesContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const groupedMessages: IMessage[][] = useMemo(() => {
    let stacks: Stacks = {};
    const messagesCopy = [...messages];

    messagesCopy.forEach(message => {
      // Формируем "key" - это строка вида "DD:MMHH:mm"
      const key = message.created
        .toLocaleString()
        .split(", ")
        .reduce((accum, item) => {
          accum += item.substring(0, 5);
          return accum;
        }, "");

      // Если сообщения с таким же временем существуют, добавляем к ним новое
      if (stacks[key]) {
        stacks = {
          ...stacks,
          [key]: [...stacks[key], message],
        };
        // Если сообщений с таким же временем нет, делаем отдельную запись с этим временем.
      } else {
        stacks = { ...stacks, [key]: [message] };
      }
    });

    // Из объекта получаем двумерный массив
    return Object.values(stacks);
  }, [messages]);

  // Скролл к новому сообщению после его добавления
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [messages.length]);

  return (
    <div className="chat-history">
      <ChatHistoryHeader />
      <div ref={scrollRef} className="chat-history__content">
        {groupedMessages.length
          ? groupedMessages.map((group: IMessage[]) => (
              <MessageGroup group={group} key={group[0].id} />
            ))
          : null}
      </div>
    </div>
  );
};
