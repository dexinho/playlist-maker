import { Button } from "@mui/material";
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
    <div className="flex gap-2 flex-col p-4 border">
      {tracks.map((track, index) => (
        <Button
          variant="contained"
          key={index}
          className="border flex flex-col gap-2"
          onClick={() => handleTrackClick(track)}
        >
          <div>
            <div>Artist: {track.artists[0].name}</div>
            <div>Song Name: {track.name}</div>
            <div>Platform: {track.uri.split(":")[0]}</div>
          </div>
          <div>
            {track.preview_url && (
              <audio controls src={track.preview_url}></audio>
            )}
          </div>
        </Button>
      ))}
    </div>
  );
};

export default Track;
