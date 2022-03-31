import React from 'react';
import './Chat.css';
import { Input } from '../Input/Input';
import { History } from '../History/History';

export const Chat = () => {
  return (
    <div className="chat">
      <History />
      <Input />
    </div>
  );
};
