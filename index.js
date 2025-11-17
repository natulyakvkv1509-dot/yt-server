import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();
app.use(cors());

// Главная проверка
app.get("/", (req, res) => {
  res.send("YouTube Downloader Server is running");
});

// Маршрут скачивания
app.get("/download", async (req, res) => {
  try {
    const videoURL = req.query.url;

    if (!videoURL) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    if (!ytdl.validateURL(videoURL)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(videoURL);
    const format = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: "audioandvideo",
      container: "mp4"
    });

    if (!format) {
      return res.status(500).json({ error: "No MP4 available" });
    }

    res.header("Content-Disposition", 'attachment; filename="video.mp4"');
    res.header("Content-Type", "video/mp4");

    ytdl(videoURL, { format }).pipe(res);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Порт
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
