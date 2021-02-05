import { useState } from 'react';
import Signin from './components/Signin';

import './App.css';
import TwilioVideos from './components/TwilioVideos';

function App() {
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('room');
  const [token, setToken] = useState(null);

  return (
    <div className='App'>
      {!token ? (
        <Signin setToken={setToken} name={name} roomName={roomName} setName={setName} setRoomName={setRoomName} />
      ) : (
        <TwilioVideos room={roomName} token={token} />
      )}
    </div>
  );
}

export default App;
