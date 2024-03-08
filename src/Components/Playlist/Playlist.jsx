import { Button } from "@mui/material";
import React from "react";

const Playlist = ({ playlist, onTrackDelete }) => {
  if (playlist.length < 1) return <div>No tracks selected.</div>;

  const handleTrackClick = (trackId) => {
    onTrackDelete(trackId);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border">
      <div>PLAYLIST</div>
      {playlist.map((track) => (
        <Button
          key={track.id}
          variant="contained"
          color="secondary"
          className="flex flex-col p-2 border"
          onClick={() => handleTrackClick(track.id)}
        >
          <div>Artist: {track.artist}</div>
          <div>Song Name: {track.songName}</div>
        </Button>
      ))}
      {playlist.length > 0 && (
        <Button variant="contained" color="success">
          UPLOAD
        </Button>
      )}
    </div>
  );
};

export default Playlist;
