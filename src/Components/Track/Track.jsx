import { Button, Box } from "@mui/material";
import React from "react";

const Track = ({ tracks, selectedTrackIds, onTrackAdd }) => {
  if (tracks.length < 1) return <Box>No tracks found.</Box>;

  const handleTrackClick = (track) => {
    onTrackAdd(track);
  };

  return (
    <Box className="grid grid-cols-2 gap-2 flex-col p-4">
      {tracks.map((track, index) => (
        <Button
          variant="contained"
          key={index}
          className="flex flex-col gap-4"
          color={selectedTrackIds[track.id] ? `error` : `primary`}
          onClick={() => handleTrackClick(track)}
        >
          <Box className="w-full flex flex-col gap-4">
            <img src={track.image_url}></img>
            <Box className="text-pretty">
              <Box>
                Artist: <span className="text-black">{track.artist_name}</span>
              </Box>
              <Box>
                Song Name: <span className="text-black">{track.song_name}</span>
              </Box>
            </Box>
          </Box>

          <Box className="w-full">
            {track.preview_url && (
              <audio
                controls
                src={track.preview_url}
                className="w-full h-4"
              ></audio>
            )}
          </Box>
        </Button>
      ))}
    </Box>
  );
};

export default Track;
