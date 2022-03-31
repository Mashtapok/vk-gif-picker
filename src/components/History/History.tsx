import React from 'react';
import { useMessagesContext } from '../../hooks/useMessagesContext';
import { Message } from '../Message/Message';
import { HistoryHeader } from './components/HistoryHeader';

import './History.css';

export const History = () => {
  const { messages } = useMessagesContext();

  return (
    <div className="history">
      <HistoryHeader />
      <div className="history__content">
        {messages.length ? messages.map((message) => <Message {...message} key={message.id} />) : null}
      </div>
    </div>
  );
};
