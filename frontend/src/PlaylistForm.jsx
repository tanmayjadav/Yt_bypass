import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ModeToggle } from './ModeToggle';

const PlaylistForm = () => {
  // const server = "http://localhost:5000";
  const server = "https://yt-bypass.onrender.com";
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [isVideo, setIsVideo] = useState(false);
  const [recentLinks, setRecentLinks] = useState([]);

  // Fetch recent links from localStorage on component mount
  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("recentLinks")) || [];
    setRecentLinks(links);

    const lastVisitedLink = localStorage.getItem("lastVisitedLink");
    if (lastVisitedLink) {
      setPlaylistUrl(lastVisitedLink);
      fetchContent(lastVisitedLink);
    }
  }, []);

  // Update localStorage with the new link
  const updateRecentLinks = (url) => {
    const links = [...recentLinks];
    if (!links.includes(url)) {
      if (links.length >= 5) links.pop(); // Limit to 5 recent links
      links.unshift(url);
      localStorage.setItem("recentLinks", JSON.stringify(links));
      setRecentLinks(links);
    }
    localStorage.setItem("lastVisitedLink", url);
  };

  // Fetch video or playlist content
  const fetchContent = async (url = playlistUrl) => {
    let playlistId = new URL(url).searchParams.get("list");
    let videoId = new URL(url).searchParams.get("v");

     if (playlistId) {
      setIsVideo(false);
      updateRecentLinks(url);
      try {
        const response = await axios.get(`${server}/${playlistId}`);
        const data = await response.data;
        setVideos(data);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    } 
    else if (videoId) {
      setIsVideo(true);
      updateRecentLinks(url);
      try {
        const response = await axios.get(`${server}/video/${videoId}`);
        setVideos([response.data]);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    }
    else {
      alert("Invalid URL. Please provide a valid YouTube playlist or video URL.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchContent();
  };

  return (
    <div className="relative">
      <div className='absolute right-3 top-3'>
        <ModeToggle />
      </div>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Playlist Form */}
        <div className="flex">
          <form onSubmit={handleSubmit} className="w-full bg-background p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold text-center text-foreground/80">Fetch YouTube Content</h2>
            <Input
              type="text"
              placeholder="Enter YouTube Playlist or Video URL"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" className="w-full py-3 bg-blue-600 text-background rounded-md shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
              Fetch Content
            </Button>
          </form>

          {/* Recently Visited Links */}
          <div className="w-72 p-4 bg-background shadow-lg">
            <h3 className="text-lg font-semibold text-foreground/90 mb-4">Recently Visited</h3>
            <ul className="space-y-2">
              {recentLinks.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                    onClick={() => fetchContent(link)}
                  >
                    {link.length > 40 ? link.substring(0, 20) + "..." : link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Display Video or Playlist */}
        <div className="grid grid-cols-1 gap-6">
          {videos.map((video) => (
            <div key={video.videoId || video.id} className="bg-background p-4 rounded-lg shadow-lg space-y-4">
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
