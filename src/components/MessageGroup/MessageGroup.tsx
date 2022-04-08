import React, { useMemo } from "react";
import { IMessage } from "../../hooks/useMessagesContext";
import { Message } from "../Message/Message";

import "./MessageGroup.css";

type Props = {
  group: IMessage[];
};

export const MessageGroup: React.FC<Props> = ({ group }) => {
  const formattedDate = useMemo(
    () => group[0].created.toLocaleTimeString([], { timeStyle: "short" }),
    [group],
  );

  return (
    <div className="message-group">
      <ul className="message-group__stack">
        {group.map(message => (
          <Message {...message} key={message.id} />
        ))}
      </ul>
      <span className="message-group__timestamp" aria-label="Время сообщения.">
        {formattedDate}
      </span>
    </div>
  );
};
