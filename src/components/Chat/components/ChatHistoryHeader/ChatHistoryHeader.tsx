import React from "react";
import { getPlural } from "../../../../helpers/array";
import { useMessagesContext } from "../../../../hooks/useMessagesContext";
import { IconDelete } from "../../../../icons";

import "./ChatHistoryHeader.css";

export const ChatHistoryHeader = () => {
  const { selectedMessages, clearSelection, deleteSelectionMessages } = useMessagesContext();

  if (!selectedMessages.length) return null;

  const onClearSelection = () => {
    clearSelection();
  };

  const onDelete = () => {
    deleteSelectionMessages();
  };

  return (
    <div className="chat-history__header header">
      <div className="header__selected-messages" onClick={onClearSelection} title="Снять выделение">
        <span className="header__selected-messages-count">{`${selectedMessages.length} ${getPlural(
          selectedMessages.length,
          ["сообщение", "сообщения", "сообщений"],
        )}`}</span>
        <button
          className="header__selected-messages-remove-btn"
          type="button"
          aria-label="Снять выделение."
        />
      </div>
      <div className="header__actions">
        <button
          className="header__action-delete"
          title="Удалить"
          aria-label="Удалить."
          type="button"
          onClick={onDelete}
        >
          <IconDelete />
        </button>
      </div>
    </div>
  );
};
