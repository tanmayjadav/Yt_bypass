const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config({ path: 'config.env' });

const app = express();
app.use(cors());
const PORT = 5000;
const API_KEY = process.env.YOUTUBE_API_KEY;

// Fetch Playlist
app.get("/:playlistId", async (req, res) => {
  const playlistId = req.params.playlistId;
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!data.items) {
      return res.status(404).json({ message: 'Playlist not found or API limit reached.' });
    }

    const videos = data.items.map((item) => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
    }));
    res.status(200).json(videos);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// Fetch Single Video
app.get("/video/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ message: 'Video not found or API limit reached.' });
    }

    const video = data.items[0];
    const videoInfo = {
      title: video.snippet.title,
      videoId: video.id,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      views: video.statistics.viewCount,
    };
    res.status(200).json(videoInfo);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
