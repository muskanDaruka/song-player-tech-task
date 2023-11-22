import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './App.css';
import io from 'socket.io-client';

const socket = io('ws://localhost:3001/ws');
const App = () => {
  const [songs, setSongs] = useState([
    { id: 1, title: '', url: 'path/to/song1.mp3' },
    { id: 2, title: '', url: 'path/to/song2.mp3' },
    // Add more songs as needed
  ]);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  useEffect(() => {
    // WebSocket event listeners
    socket.on('newSongAdded', (newSong) => {
      setSongs((prevSongs) => [...prevSongs, newSong]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleAddSong = () => {
    const newSongUrl = prompt('Enter the URL of the new song:');
    const newSongTitle = prompt('Enter the title of the new song:');
    if (newSongUrl && newSongTitle) {
      const newSong = {
        id: songs.length + 1,
        title: newSongTitle,
        url: newSongUrl,
      };
      socket.emit('newSongAdded', newSong);
      setSongs([...songs, newSong]);
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <h1>Songs Listing</h1>
      <button onClick={handleAddSong}>Add Song</button>
      {songs.map((song, index) => (
        <div className="song" key={song.id}>
          <p>{song.title}</p>
          <audio controls>
            <source src={song.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ))}
      <div className="player-container">
        <AudioPlayer
          autoPlay
          src={songs[currentSongIndex].url}
          onEnded={() => setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length)}
        />
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default App;
