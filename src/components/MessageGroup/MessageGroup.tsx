import React, { useMemo } from "react";
import { IMessage } from "../../hooks/useMessagesContext";
import { Message } from "../Message/Message";

import "./MessageGroup.css";

type Props = {
  group: IMessage[];
};

export const MessageGroup: React.FC<Props> = ({ group }) => {
  const formatedDate = useMemo(
    () => group[0].created.toLocaleTimeString([], { timeStyle: "short" }),
    [group],
  );

  return (
    <div className="message-group">
      <div className="message-group__stack">
        {group.map(message => (
          <Message {...message} key={message.id} />
        ))}
      </div>
      <div className="message-group__timestamp">{formatedDate}</div>
    </div>
  );
};
