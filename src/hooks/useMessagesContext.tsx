import { IGif } from '@giphy/js-types';
import React, { createContext, useState } from 'react';

export type IMessage = {
  gif?: IGif,
  text?: string,
  created: Date,
  id: number,
}

export type IState = {
  messages: IMessage[],
  selectedMessages: IMessage[],
  addMessage: (newMessage: IMessage) => void,
  toggleSelection: (newMessage: IMessage) => void,
  clearSelection: () => void,
  deleteSelectionMessages: () => void,
}

const MessagesContext = createContext<IState | null>(null);

const MessagesProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<IMessage[]>([]);

  const addMessage = (newMessage: IMessage): void => {
    setMessages([newMessage, ...messages]);
  };

  const toggleSelection = (selectedMessage: IMessage): void => {
    const copy = [...selectedMessages];
    if (copy.find(message => message.id === selectedMessage.id)) {
      setSelectedMessages(copy.filter(message => message.id !== selectedMessage.id));
    } else {
      setSelectedMessages([selectedMessage, ...selectedMessages]);
    }
  };

  const clearSelection = (): void => {
    setSelectedMessages([]);
  };

  const deleteSelectionMessages = (): void => {
    const readyForDeleteIds = selectedMessages.map(selected => selected.id);
    const copy = [...messages];

    const newMessages = copy.filter(message => !readyForDeleteIds.includes(message.id));

    setSelectedMessages([]);
    setMessages(newMessages);
  };

  return (
    <MessagesContext.Provider
      value={{
        addMessage,
        toggleSelection,
        clearSelection,
        deleteSelectionMessages,
        messages,
        selectedMessages,
      }}>{children}</MessagesContext.Provider>
  );
};

const useMessagesContext = () => {
  const context = React.useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessagesContext must be used within a MessagesProvider');
  }
  return context;
};

export { MessagesProvider, useMessagesContext };
