import express from "express";
import ytdl from "ytdl-core";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// === DOWNLOAD MP4 ===
app.get("/download", async (req, res) => {
  try {
    const url = req.query.url;

    // Проверка URL
    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    // Получаем информацию о видео
    const info = await ytdl.getInfo(url);

    // Выбираем лучший MP4 формат
    const format = ytdl.chooseFormat(info.formats, {
      filter: "audioandvideo",
      container: "mp4",
      quality: "highest"
    });

    if (!format || !format.url) {
      return res.status(500).json({ error: "MP4 format not available" });
    }

    // Заголовки для скачивания
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");

    // Стрим видео
    ytdl(url, { format }).pipe(res);

  } catch (err) {
    console.error("Download error:", err);
    return res.status(500).json({ error: "Server error during download" });
  }
});

// Главная страница
app.get("/", (req, res) => {
  res.send("YouTube MP4 download server is running");
});

// Запуск сервера
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`YT server running on port ${PORT}`);
});
