import React, { useState } from 'react';
import axios from "axios";

const PlaylistForm = () => {
  const server = "http://localhost:5000";
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState([]);

  const fetchPlaylist = async (e) => {
    e.preventDefault();
    const playlistId = new URL(playlistUrl).searchParams.get("list");
    console.log(playlistId);
    try {
      const response = await axios.get(`${server}/${playlistId}`);
      console.log(response);
      const data = await response.data;
      setVideos(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  return (
    <div>
      <form onSubmit={fetchPlaylist}>
        <input
          type="text"
          placeholder="Enter YouTube Playlist URL"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
        />
        <button type="submit">Fetch Playlist</button>
      </form>

      <div>
        {videos.map((video) => (
          <div key={video.videoId}>
            <h3>{video.title}</h3>
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistForm;
