import React from 'react';
import { Chat } from './components/Chat/Chat';
import { MessagesProvider } from './hooks/useMessagesContext';
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";

export const App = () => {
  return (
    <MessagesProvider>
      <ThemeSwitcher />
      <Chat />
    </MessagesProvider>
  );
};
