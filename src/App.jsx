import React, { useEffect, useState, useRef } from "react";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import Track from "./Components/Track/Track";
import Playlist from "./Components/Playlist/Playlist";
import getApiKeys from "./utility/getApiKeys";
import getAccessToken from "./utility/getAccessToken";
import searchTracks from "./utility/searchTracks";
import createPlaylist from "./utility/createPlaylist";
import getAuthorizationUrl from "./utility/getAuthorizationUrl";
import getUserProfile from "./utility/getUserProfile";
import getAccessTokenForPlaylist from "./utility/getAccessTokenForPlaylist";

const user_id = "31fnwumqzhtohbvkxcjglctzgzpq";
const code =
  "AQDeGHPncLHuA4a8mf-ScnA1uWh6lUZkJnHx9qPX3E1lQ9BYkSOjxOtINUe70d6OnNB4ihR1taVNP5vL7_E756gS7bQRWaX-0uDmnbVaNgLhmcHtx0SBEdRRtMuY94l-EIPU4DgnhAzudnkRV5ARlsA0c28fopDT-TyodmTwwdAtlOYJRWuwdswibKL5nBdRL2MDoo8WBuocDg";

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [selectedTrackIds, setSelectedTrackIds] = useState({});
  const [apiKeys, setApiKeys] = useState();
  const [accessTokens, setAccessTokens] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [fetchedTracks, setFetchedTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const clientSecretInputRef = useRef(null);
  const clientIdInputRef = useRef(null);

  useEffect(() => {
    const apiSetup = async () => {
      const apiKeys = await getApiKeys({
        url: "http://localhost:3000/api/spotify",
        setApiKeys,
        isFetching,
        setIsFetching,
      });

      const spotifyAccessTokenSettings = {
        url: `https://accounts.spotify.com/api/token`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${apiKeys.spotify.client_id}&client_secret=${apiKeys.spotify.client_secret}`,
        },
      };

      const spotifyAccessToken = await getAccessToken({
        url: spotifyAccessTokenSettings.url,
        options: spotifyAccessTokenSettings.options,
        isFetching,
        setIsFetching,
      });

      setAccessTokens((prevT) => ({
        ...prevT,
        spotify: spotifyAccessToken,
      }));
    };

    apiSetup();
    // const client_id = "404cae06b37c4e3897ab0dbfec5bd047";
    // const client_secret = "d3b356e7507a4cc5a44fa8fe9942f64c"

    // const tidalAccessTokenSettings = {
    //   url: `https://auth.tidal.com/v1/oauth2/token`,
    //   options: {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //     body: new URLSearchParams({
    //       client_id: process.env["TIDAL_CLIENT_ID"],
    //       client_secret: process.env["TIDAL_CLIENT_SECRET"],
    //       grant_type: "client_credentials",
    //     }),
    //   },
    // };

    // getAccessToken({
    //   tidalAccessTokenSettings: { url },
    //   tidalAccessTokenSettings: { options },
    //   tokenBelongsTo: "tidal",
    // });
  }, []);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyDown = async (e) => {
    if (e.key === "Enter") {
      const foundTracks = await searchTracks({
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchInput
        )}&type=track`,
        accessToken: accessTokens.spotify,
        isFetching,
        setIsFetching,
      });

      setFetchedTracks(
        foundTracks.reduce(
          (acc, item) => [
            ...acc,
            {
              id: item.id,
              artist_name: item.artists[0].name,
              song_name: item.name,
              image_url: item.album.images[0].url,
              preview_url: item.preview_url,
              track_uri: item.uri,
            },
          ],
          []
        )
      );

      setSearchInput("");

      // const authHref = getAuthorizationUrl({
      //   scopes: "playlist-modify-public",
      //   client_id: apiKeys.spotify.client_id,
      //   redirect_uri: "http://localhost:3000/callback",
      //   response_type: "code",
      // });

      // const a = document.createElement("a");
      // a.href = authHref;
      // a.target = "_blank";
      // a.click();

      // const token = await getAccessTokenForPlaylist({
      //   code,
      //   client_id: apiKeys.spotify.client_id,
      //   client_secret: apiKeys.spotify.client_secrete,
      //   redirect_uri: "http://localhost:3000/callback",
      // });

      // const profile = await getUserProfile({
      //   access_token: accessTokens.spotify,
      //   isFetching,
      //   setIsFetching,
      // });

      console.log("token", token);
    }
  };

  const onTrackAdd = (track) => {
    setSelectedTrackIds((prevS) => ({
      ...prevS,
      [track.id]: !prevS[track.id],
    }));
    setPlaylist([...playlist, track]);
  };

  const onTrackDelete = (trackId) => {
    setSelectedTrackIds((prevS) => ({ ...prevS, [trackId]: false }));
  };

  const onPlaylistUpload = async (playlist_name) => {
    createPlaylist({
      access_token: accessTokens.spotify,
      user_id,
      playlist_name,
    });
  };

  useEffect(() => {
    setPlaylist((prevP) => prevP.filter((e) => selectedTrackIds[e.id]));
  }, [selectedTrackIds]);

  return (
    <Box className="relative w-full min-h-screen overflow-y-auto">
      <Box
        className="absolute top-0 left-0 -z-10 w-full h-full"
        sx={{
          backgroundColor: "rgb(136,136,136)",
          background:
            "linear-gradient(318deg, rgba(136,136,136,1) 6%, rgba(230,218,139,1) 66%)",
        }}
      ></Box>
      <Box className="p-4 flex items-center flex-col gap-4">
        <Typography variant="h3">PLAYLIST MAKER</Typography>
        <Box className="flex gap-4 flex-row">
          <TextField placeholder="CLIENT ID" ref={clientIdInputRef}></TextField>
          <TextField
            placeholder="CLIENT SECRET"
            ref={clientSecretInputRef}
          ></TextField>
        </Box>
        <TextField
          placeholder="SONG NAME"
          className="w-full"
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchKeyDown}
        ></TextField>
        <Box className="grid grid-cols-2 gap-4 justify-between border border-black w-full p-4">
          <Track
            tracks={fetchedTracks}
            selectedTrackIds={selectedTrackIds}
            onTrackAdd={onTrackAdd}
          />
          <Box>
            <Playlist
              playlist={playlist}
              onTrackDelete={onTrackDelete}
              onPlaylistUpload={onPlaylistUpload}
            />
          </Box>
        </Box>
        {isFetching && (
          <Box className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <CircularProgress></CircularProgress>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;
