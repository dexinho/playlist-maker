import { Button, Box, TextField } from "@mui/material";
import React, { useRef } from "react";

const Playlist = ({ playlist, onTrackDelete, onPlaylistUpload }) => {
  const playlistNameInputRef = useRef(null);

  if (playlist.length < 1) return <div>No tracks selected.</div>;

  const handleTrackClick = (trackId) => {
    onTrackDelete(trackId);
  };

  const handlePlaylistUpload = () => {
    onPlaylistUpload({ playlist_name: playlistNameInputRef.current.value });
  };

  return (
    <Box className="flex flex-col gap-4 p-4">
      <TextField
        inputRef={playlistNameInputRef}
        placeholder="PLAYLIST NAME"
        className="w-full"
      ></TextField>
      {playlist.map((track, index) => (
        <Button
          key={index}
          variant="contained"
          color="secondary"
          className="flex flex-col p-2 border"
          onClick={() => handleTrackClick(track.id)}
        >
          <Box>Artist: {track.artist_name}</Box>
          <Box>Song Name: {track.song_name}</Box>
        </Button>
      ))}
      {playlist.length > 0 && (
        <Button
          variant="contained"
          color="success"
          onClick={handlePlaylistUpload}
        >
          UPLOAD
        </Button>
      )}
    </Box>
  );
};

export default Playlist;
