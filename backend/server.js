import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

const PORT = 3000;
const host = "localhost";

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/callback", (req, res) => {
  try {
    const code = req.query.code;

    res.status(200).json({ code });
  } catch (err) {
    res.status(500);
  }
});

app.get("/api/spotify", (req, res) => {
  res.status(200).json({
    spotify: {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    },
  });
});

app.get("/api/tidal", (req, res) => {
  res.status(200).json({
    tidal: {
      client_id: process.env.TIDAL_CLIENT_ID,
      client_secret: process.env.TIDAL_CLIENT_SECRET,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://${host}:${PORT}`);
});
