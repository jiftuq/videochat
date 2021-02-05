import { useEffect, useRef, useState } from 'react';

import TwilioVideo from 'twilio-video';

import './TwilioVideos.css';

const TwilioVideos = ({ token, roomName }) => {

  
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const localVideoShareScreenRef = useRef();

  const [screenTrackView, setScreenTrackView] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [room, setRoom] = useState(false);

  useEffect(() => {
    TwilioVideo.connect(token, {
      video: true,
      audio: true,
      name: roomName,
    }).then((room) => {
      setRoom(room);
      // Attach the local video
      TwilioVideo.createLocalVideoTrack()
        .then((track) => {
          localVideoRef.current.appendChild(track.attach());
        })
        .catch((error) => {
          console.log('Error: ', error.response);
        });

      const addParticipant = (participant) => {
        console.log('new participant!');
        console.log(participant);

        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed) {
            const track = publication.track;

            remoteVideoRef.current.appendChild(track.attach());
            console.log('attached to remote video');
          }
        });

        participant.on('trackSubscribed', (track) => {
          console.log('track subscribed');
          remoteVideoRef.current.appendChild(track.attach());
        });
      };

      room.participants.forEach(addParticipant);
      room.on('participantConnected', addParticipant);
    });
  }, [token, roomName]);

  const shareScreen = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        return Promise.reject(new Error('getDisplayMedia no soportado.'));
      }

      const screenTrack = await navigator.mediaDevices
        .getDisplayMedia({
          video: { height: 1080, width: 1920 },
        })
        .then(function (stream) {
          return new TwilioVideo.LocalVideoTrack(stream.getVideoTracks()[0], { name: `${roomName}` });
        });

      localVideoShareScreenRef.current.appendChild(screenTrack.attach());

      // Muestra una nueva pantalla
      room.localParticipant.publishTrack(screenTrack);

      localVideoRef.current.classList.add('ocultarPantalla');
      localVideoShareScreenRef.current.classList.add('mostrarPantalla');

      setScreenTrackView(screenTrack);
      setIsSharing(true);
    } catch (error) {
      console.log('error::', error);
      setIsSharing(false);
    }
  };

  const stopShareScreen = () => {
    localVideoRef.current.classList.remove('ocultarPantalla');
    localVideoShareScreenRef.current.classList.remove('mostrarPantalla');

    screenTrackView.stop();
    room.localParticipant.unpublishTrack(screenTrackView);
    setIsSharing(false);
  };

  return (
    <div>
      <h2>Room: {roomName}</h2>

      <div className='localVideo' ref={localVideoRef}></div>
      <div className='localVideoShare' ref={localVideoShareScreenRef}></div>
      <div className='remoteVideo' ref={remoteVideoRef}></div>

      {!isSharing ? <button onClick={shareScreen}>Share Screen</button> : <button onClick={stopShareScreen}>Stop Share Screen</button>}
    </div>
  );
};

export default TwilioVideos;
