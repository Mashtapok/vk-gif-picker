import React from "react";
import { getPlural } from "../../../../helpers/array";
import { useMessagesContext } from "../../../../hooks/useMessagesContext";
import { IconDelete } from "../../../../icons";

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
    <div className="history__header">
      <div className="history__selected-messages" onClick={onClearSelection} title="Снять выделение">
          <span
            className="history__selected-messages-count">{`${selectedMessages.length} ${getPlural(selectedMessages.length,
            ["сообщение", "сообщения", "сообщений"])}`}</span>
        <button className="history__selected-messages-remove-btn"
                type="button"
                aria-label="Снять выделение." />
      </div>
      <div className="history__actions">
        <button className="history__action-delete"
                title="Удалить"
                aria-label="Удалить."
                type="button"
                onClick={onDelete}>
         <IconDelete />
        </button>
      </div>
    </div>
  );
};
