import React, { useEffect, useState } from 'react';
import socket from '../../hooks/useSocket';
import { protectedApi } from '../../services/api/protectedAndPublicAPI';
const ChatWidget: React.FC<any> = ({ currentUserId, recipient }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!currentUserId || !recipient) return;

    // fetch history from backend (which proxies to socket server)
    (async () => {
      try {
        const res = await protectedApi.get(`/api/chat/history/${currentUserId}/${recipient.id}`);
        setMessages(res.data || []);
      } catch (err) {
        // silent
      }
    })();

    // listen for incoming messages
    const handler = (msg: any) => {
      // ensure message belongs to this chat (basic check)
      if ((msg.from === recipient.id && msg.to === currentUserId) || (msg.from === currentUserId && msg.to === recipient.id)) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('chat:message', handler);

    return () => {
      socket.off('chat:message', handler);
    };
  }, [currentUserId, recipient]);

  const sendMessage = async () => {
    if (!text) return;
    const payload = {
      from: currentUserId,
      to: recipient.id,
      message: text,
      timestamp: Date.now()
    };
    try {
      await protectedApi.post('/api/chat', payload);
    } catch (e) {
      // fallback: emit directly
      socket.emit('chat:message', payload);
    }
    setMessages(prev => [...prev, payload]);
    setText('');
  };

  return (
    <div className="chat-widget">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.from === currentUserId ? 'msg me' : 'msg other'}>{m.message}</div>
        ))}
      </div>
      <div className="composer">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;
