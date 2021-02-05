import axios from 'axios';

const Signin = ({ setToken, name, roomName, setName, setRoomName }) => {
  const handlerSubmit = async (e) => {
    e.preventDefault();

    console.log('Name:: ', name);
    console.log('Room', roomName);

    await axios.post('https://persimmon-hamster-5511.twil.io/airsvelte', {
      identity: name,
      room: roomName,
    }).then( response => {
      console.log('response: ', response.data)
      setToken(response.data);
    });
    
  };

  return (
    <form onSubmit={handlerSubmit}>
      <label htmlFor='name'>
        Nombre
        <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label htmlFor='room'>
        Sala
        <input type='text' id='room' value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      </label>

      <br />
      <button type='submit'>Ingresar a la Sala</button>
    </form>
  );
};

export default Signin;
