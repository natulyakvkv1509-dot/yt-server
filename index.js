import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({ error: "Missing URL parameter" });
    }

    // Получаем инфу
    const info = await ytdl.getInfo(url);

    // Выбираем лучший MP4 формат
    const format = ytdl.chooseFormat(info.formats, {
      filter: "audioandvideo",
      quality: "highest",
      // Гарантия, что формат будет mp4
      container: "mp4"
    });

    if (!format || !format.url) {
      return res.status(500).json({ error: "MP4 format not available" });
    }

    // Отдаём файл как MP4
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="video.mp4"'
    );
    res.setHeader("Content-Type", "video/mp4");

    ytdl(url, {
      format: format,
      filter: "audioandvideo"
    }).pipe(res);

  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Server error during download" });
  }
});

app.get("/", (req, res) => {
  res.send("YouTube MP4 download server is running");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log(YT server running on port ${PORT})
);
