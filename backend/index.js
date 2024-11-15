const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config({ path: 'config.env' });

const app = express();
app.use(cors());
const PORT = 5000;
const API_KEY = process.env.YOUTUBE_API_KEY;
// console.log(process.env.YOUTUBE_API_KEY);
app.get("/:playlistId", async (req, res) => {
  console.log(API_KEY);
  const playlistId = req.params.playlistId;
  console.log(playlistId);
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data)
    if (!data.items) {
      return res.status(404).json({ message: 'Playlist not found or API limit reached.' });
    }

    const videos = data.items.map((item) => ({
      title: item.snippet.title,
      videoId: item.snippet.resourceId.videoId,
    }));
    console.log(videos);
    res.status(200).json(videos);

  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
