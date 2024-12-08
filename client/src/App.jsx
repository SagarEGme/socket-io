
import { useEffect } from 'react';
import { useState } from 'react';
import { io } from "socket.io-client"

// connection established
const socket = io('http://localhost:4000', {
  transports: ['polling', 'websocket'],  // Fallback to polling if WebSocket fails
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const [roomName,setRoomName] = useState('')

  useEffect(() => {
    socket.on('connect', () => {
      setSocketID(socket.id)
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });

    socket.on('received-msg', (msg) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    });

    socket.on("welcome", (msg) => {
      console.log("welcome msg", msg)
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
      socket.emit('message', {message,room}); // Send the message to the server
      setMessage('');
      console.log(message)
    }
  };

  const handleJoinRoom=(e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName)
    setRoomName("")
  }
  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Socket.IO React Chat</h1>
        <h3>{socketID}</h3>
        <form onSubmit={handleJoinRoom}>
          <h3>join room</h3>
          <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <button type='submit'>Join</button>
        </form>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <input
          type="text"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="Enter room to send msg"
          style={{ marginRight: '10px', padding: '5px', width: '70%' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px' }}>Send</button>
        <div style={{ border: '1px solid #ccc', padding: '10px', height: '200px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>

      </div>
    </>
  )
}

export default App
