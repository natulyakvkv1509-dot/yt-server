import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("YouTube Downloader Server is running");
});

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
