import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [socketID, setSocketID] = useState('');
  const [roomName, setRoomName] = useState('');
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:4000', {
      transports: ['polling', 'websocket'],
    });

    socket.current.on('connect', () => {
      setSocketID(socket.current.id);
      console.log('Socket connected:', socket.current.id);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected:', socket.current.id);
    });

    socket.current.on('received-msg', (msg) => {
      setMessages((prevMsg) => [...prevMsg, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgObj = { message, room, sender: socketID };
      socket.current.emit('message', msgObj);
      setMessages((prevMsg) => [...prevMsg, msgObj]); 
      setMessage('');
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      socket.current.emit('join-room', roomName);
      setRooms((prevRooms) => [...prevRooms, roomName]);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Chat App</h1>
        <p style={styles.socketInfo}>Your ID: {socketID}</p>
      </header>
      <div style={styles.chatWrapper}>
        <aside style={styles.sidebar}>
          <form onSubmit={handleJoinRoom} style={styles.form}>
            <h3>Join Room</h3>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter room name"
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Join</button>
          </form>
          <div>
            <h6>Available Rooms:</h6>
            {rooms.map((room, index) => (
              <h6 key={index}>{room}</h6>
            ))}
          </div>
        </aside>
        <main style={styles.main}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === socketID ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === socketID ? '#d1e7dd' : '#e9ecef',
                }}
              >
                <p>{msg.message}</p>
                {console.log(msg.message)}
              </div>
            ))}
          </div>
          <div style={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ ...styles.input, flex: 1 }}
            />
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room"
              style={{ ...styles.input, flex: 1 }}
            />
            <button onClick={sendMessage} style={styles.button}>Send</button>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Arial', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    color: '#333',
  },
  header: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textAlign: 'center',
  },
  title: {
    margin: 0,
  },
  socketInfo: {
    fontSize: '0.9em',
    opacity: 0.8,
  },
  chatWrapper: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  sidebar: {
    width: '25%',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #ddd',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    outline: 'none',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  messages: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
    wordWrap: 'break-word',
  },
  inputArea: {
    display: 'flex',
    flex:"flex-wrap",
    gap: '10px',
    padding: '10px',
    borderTop: '1px solid #ddd',
    backgroundColor: '#fff',
  },
};

export default App;
