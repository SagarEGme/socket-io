
import { useEffect } from 'react';
import { useState } from 'react';
import {io} from "socket.io-client"

// connection established
const socket = io('http://localhost:4000') 

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    socket.on('message',(msg)=>{
      setMessages((prevMsg) => [...prevMsg,msg]);
    })
    return ()=>{
      socket.disconnect();
    }
  },[])

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('message', message); // Send the message to the server
      setMessage('');
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
