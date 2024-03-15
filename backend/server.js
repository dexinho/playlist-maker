import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import getAccessToken from "./getAccessToken.js";

const app = express();

const PORT = 3000;
const host = "localhost";

dotenv.config();

app.use(cors());
app.use(express.json());

app.get("/callback", async (req, res) => {
  try {
    const code = req?.query?.code;

    if (code) {
      await fs.writeFile(`./code.txt`, code, "utf-8");
      res.send("ACCESS GRANTED!");
    } else {
      res.send("ACCESS DENIED!");
    }
  } catch (err) {
    res.status(500);
    console.log(err);
  }
});

app.get("/code", async (req, res) => {
  const code = await fs.readFile("./code.txt", "utf-8");
  await fs.unlink("./code.txt");

  res.status(200).json({ code });
});

app.get("/isFileReady", async (req, res) => {
  const files = await fs.readdir("./");

  if (files.find((file) => file === "code.txt")) res.status(200).json({});
  else res.status(503).json({});
});

app.post("/token", async (req, res) => {
  const { client_id, client_secret, code, redirect_uri } = req.body;
  console.log(req.body);
  try {
    const token = await getAccessToken({
      client_id,
      client_secret,
      code,
      redirect_uri,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
});

app.get("/api/spotify", (req, res) => {
  res.status(200).json({
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
  });
});

app.get("/api/tidal", (req, res) => {
  res.status(200).json({
    tidal: {
      clientId: process.env.TIDAL_CLIENT_ID,
      clientSecret: process.env.TIDAL_CLIENT_SECRET,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://${host}:${PORT}`);
});
