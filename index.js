const url = req.query.url;

if (!url) {
  return res.status(400).json({ error: "No URL provided" });
}

if (!ytdl.validateURL(url)) {
  return res.status(400).json({ error: "Invalid YouTube URL" });
}

const info = await ytdl.getInfo(url);

const format = ytdl.chooseFormat(info.formats, {
  filter: "audioandvideo",
  container: "mp4",
  quality: "highest"
});

if (!format || !format.url) {
  return res.status(500).json({ error: "MP4 format not available" });
}

res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
res.setHeader("Content-Type", "video/mp4");

ytdl(url, { format }).pipe(res);
