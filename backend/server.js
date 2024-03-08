import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

const PORT = 3000;
const host = "localhost";

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/api/spotify", (req, res) => {
  res.status(200).json({spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  }});
});

app.get("/api/tidal", (req, res) => {
  res.status(200).json({tidal: {
    clientId: process.env.TIDAL_CLIENT_ID,
    clientSecret: process.env.TIDAL_CLIENT_SECRET,
  }});
});

app.listen(PORT, () => {
  console.log(`Server listening on http://${host}:${PORT}`);
});
