import React, { useEffect, useState } from "react";
import fecthData from "./utility/fetchData";
import { Box, TextField } from "@mui/material";
import Track from "./Components/Track/Track";
import Playlist from "./Components/Playlist/Playlist";

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [apiKeys, setApiKeys] = useState({});
  const [accessTokens, setAccessTokens] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [fetchedTracks, setFetchedTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  // { id: 0, artist: "", songName: "", availableOn: [] }

  useEffect(() => {
    const getApiKeys = async ({ url }) => {
      try {
        const res = await fecthData({ url, isFetching, setIsFetching });

        if (res.ok) {
          const apiKeys = await res.json();

          console.log("apiKeys", apiKeys);

          setApiKeys((prevK) => ({ ...prevK, apiKeys }));

          return apiKeys;
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getAccessToken = async ({ url, options, tokenBelongsTo }) => {
      try {
        const res = await fecthData({
          url,
          options,
          isFetching,
          setIsFetching,
        });

        if (res.ok) {
          const data = await res.json();
          setAccessTokens((prevT) => ({
            ...prevT,
            [tokenBelongsTo]: data.access_token,
          }));
        }
      } catch (err) {
        console.log(err);
      }
    };

    const apiSetup = async () => {
      const apiKeys = await getApiKeys({
        url: "http://localhost:3000/api/spotify",
      });

      console.log(apiKeys);

      const spotifyAccessTokenSettings = {
        url: `https://accounts.spotify.com/api/token`,
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `grant_type=client_credentials&client_id=${apiKeys.spotify.clientId}&client_secret=${apiKeys.spotify.clientSecret}`,
        },
      };

      await getAccessToken({
        url: spotifyAccessTokenSettings.url,
        options: spotifyAccessTokenSettings.options,
        tokenBelongsTo: "spotify",
      });
    };

    apiSetup();
    // const clientId = "404cae06b37c4e3897ab0dbfec5bd047";
    // const clientSecret = "d3b356e7507a4cc5a44fa8fe9942f64c"

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

  const getTrack = async ({ url, accessToken }) => {
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fecthData({ url, options, isFetching, setIsFetching });

    if (res.ok) {
      const data = await res.json();
      console.log(data.tracks.items);
      setFetchedTracks(data.tracks.items);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      getTrack({
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchInput
        )}&type=track`,
        accessToken: accessTokens.spotify,
      });
      setSearchInput("");
    }
  };

  const onTrackAdd = (track) => {
    setPlaylist((prevT) => [...prevT, track]);
  };

  const onTrackDelete = (trackId) => {
    setPlaylist((prevT) => prevT.filter((T) => T.id !== trackId));
  };

  return (
    <div className="p-4 flex items-center flex-col">
      <TextField
        placeholder="song name"
        className="w-full"
        onChange={handleSearchInputChange}
        onKeyDown={handleSearchKeyDown}
      ></TextField>
      <Box className="grid grid-cols-2 g-4 justify-between border w-full">
        <Track tracks={fetchedTracks} onTrackAdd={onTrackAdd} />
        <Playlist playlist={playlist} onTrackDelete={onTrackDelete} />
      </Box>
    </div>
  );
};

export default App;
