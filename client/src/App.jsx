
import { useEffect } from 'react';
import { useState } from 'react';
import {io} from "socket.io-client"

// connection established
const socket = io('http://localhost:4000', {
  transports: ['polling', 'websocket'],  // Fallback to polling if WebSocket fails
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {  
    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    }); 

    socket.on('message', (msg) => {
        setMessages((prevMsg) => [...prevMsg, msg]);
    });

    socket.on("welcome",(msg)=>{
      console.log("welcome msg",msg)
    })
    return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('message');
        socket.disconnect();
    };
}, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message); // Send the message to the server
      setMessage('');
      console.log(message)
    }
  };
  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Socket.IO React Chat</h1>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px' }}>Send</button>
      </div>
    </>
  )
}

export default App
