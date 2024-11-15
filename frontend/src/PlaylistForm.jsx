import React, { useState } from 'react';
import axios from "axios";
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { ModeToggle } from './ModeToggle';

const PlaylistForm = () => {
  const server = "https://yt-bypass.onrender.com";
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
    <div clasName="">
      <div className='absolute right-3 top-3'>
      <ModeToggle />
      </div>
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Playlist Form */}
      <form onSubmit={fetchPlaylist} className="bg-background p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-center text-foreground/80">Fetch YouTube Playlist</h2>
        <Input
          type="text"
          placeholder="Enter YouTube Playlist URL"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="w-full py-3 bg-blue-600 text-background rounded-md shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
          Fetch Playlist
        </Button>
      </form>

      {/* Playlist Display */}
      <div className="grid grid-cols-1 gap-6">
        {videos.map((video) => (
          <div key={video.videoId} className="bg-background p-4 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold text-foreground/90">{video.title}</h3>
            <iframe
              width="100%"
              height="415"
              src={`https://www.youtube.com/embed/${video.videoId}`}
              frameBorder="0"
              allowFullScreen
              className="rounded-lg shadow-md"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
};

export default PlaylistForm;
