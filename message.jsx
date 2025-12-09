import React from 'react';
import { formatMessage } from '../utils/messageFormatter';

export default function MessageBubble({ message }) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
            : 'bg-slate-700 text-slate-100'
        }`}
      >
        {message.formatted ? (
          <div 
            className="formatted-content"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
}
