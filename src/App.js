import React, { useState, useEffect } from 'react';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;

  const styles = {
    app: {
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    },
    h1: {
      fontSize: '2rem',
      marginBottom: '20px',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      fontSize: '1rem',
      border: '2px solid #3498db',
      borderRadius: '5px',
      outline: 'none',
    },
    ul: {
      listStyle: 'none',
      padding: '0',
    },
    li: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between', // Adjusted for button alignment
      backgroundColor: '#fff',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#2980b9',
    },
    h2: {
      fontSize: '1.5rem',
      margin: '20px 0',
    },
    audio: {
      width: '100%',
      marginTop: '10px',
    },
    songImage: {
      width: '80px',
      height: '80px',
      marginRight: '10px',
      objectFit: 'cover',
    },
  };

  const paginationStyles = `
    .pagination {
      display: flex;
      list-style: none;
      padding: 0;
      justify-content: center;
      margin-top: 20px;
    }
    
    .pagination li {
      margin: 0 5px;
    }
    
    .pagination button {
      background-color: #3498db;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .pagination button:hover {
      background-color: #2980b9;
    }
  `;

  useEffect(() => {
    const searchTermEncoded = encodeURIComponent(searchTerm);
    const endpoint = `https://itunes.apple.com/search?term=${searchTermEncoded}&entity=song`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        const songs = data.results.map((song) => ({
          id: song.trackId,
          title: song.trackName,
          url: song.previewUrl,
          imageUrl: song.artworkUrl100,
        }));
        setSongs(songs);
      })
      .catch((error) => {
        console.error('Error fetching song data:', error);
      });
  }, [searchTerm]);

  const playSong = (url) => {
    if (currentSong !== url) {
      setCurrentSong(url);
    }
  };

  const stopSong = () => {
    setCurrentSong(null);
  };

  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;
  const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={styles.app}>
      <h1 style={styles.h1}>React Music Player</h1>
      {currentSong && (
        <div>
          <h2 style={styles.h2}>Now Playing</h2>
          <audio controls autoPlay src={currentSong} style={styles.audio} />
          <button onClick={stopSong} style={styles.button}>
            Stop
            
          </button>
          <br />
          <br />
        </div>
      )}
      <input
        type="text"
        placeholder="Search for songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <ul style={styles.ul}>
        {currentSongs.map((song) => (
          <li key={song.id} style={styles.li}>
            <img
              src={song.imageUrl}
              alt={song.title}
              style={styles.songImage}
            />
            <p>{song.title}</p>
            <button
              onClick={() => playSong(song.url)}
              style={{ ...styles.button, ...styles.buttonHover }}
            >
              Play
            </button>
          </li>
        ))}
      </ul>
      <style>{paginationStyles}</style>
      {songs.length > songsPerPage && (
        <div>
          <ul className="pagination">
            {Array.from({ length: Math.ceil(songs.length / songsPerPage) }, (_, i) => (
              <li key={i}>
                <button onClick={() => paginate(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;