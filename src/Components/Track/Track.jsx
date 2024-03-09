import { Button, Box } from "@mui/material";
import React from "react";

const Track = ({ tracks, onTrackAdd }) => {
  if (tracks.length < 1) return <div>No tracks found</div>;

  const handleTrackClick = (track) => {
    onTrackAdd({
      id: Date.now(),
      artist: track.artists[0].name,
      songName: track.name,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-2 flex-col p-4 border">
      {tracks.map((track, index) => (
        <Button
          variant="contained"
          key={index}
          className="flex flex-col gap-4"
          onClick={() => handleTrackClick(track)}
        >
          <Box className="w-full h-20 grid grid-cols-2 gap-4 border">
            <img
              src={track.album.images[0].url}
            ></img>
            <div className="text-pretty">
              <div>Artist: {track.artists[0].name}</div>
              <div>Song Name: {track.name}</div>
              <div>Platform: {track.uri.split(":")[0]}</div>
            </div>
          </Box>

          <div className="w-full border">
            {track.preview_url && (
              <audio controls src={track.preview_url} className="w-full h-4"></audio>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Track;
