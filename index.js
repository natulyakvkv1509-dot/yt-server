import express from "express";
import cors from "cors";
import ytdl from "@distube/ytdl-core";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/download", async (req, res) => {
  try {
    const { url, quality } = req.body;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    const valid = ytdl.validateURL(url);
    if (!valid) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, {
      quality: quality || "highest",
    });

   res.header("Content-Disposition", 'attachment; filename="video.mp4"');

    ytdl(url, { format }).pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download error" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("YT server running on port " + PORT)
);
