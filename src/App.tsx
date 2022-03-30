import React from 'react';
import './App.css';
import { Chat } from './components/Chat/Chat';
import { MessagesProvider } from './hooks/useMessagesContext';

export const App = () => {
  return (
    <MessagesProvider>
      <Chat />
    </MessagesProvider>
  );
};
