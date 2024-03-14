import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Track from "./Components/Track/Track";
import Playlist from "./Components/Playlist/Playlist";
import getApiKeys from "./utility/getApiKeys";
import getAccessToken from "./utility/getAccessToken";
import searchTracks from "./utility/searchTracks";
import createPlaylist from "./utility/createPlaylist";
import getAuthorizationUrl from "./utility/getAuthorizationUrl";
import getUserProfile from "./utility/getUserProfile";
import addTracksToPlaylist from "./utility/addTracksToPlaylist";
import delayMS from "./utility/delayMS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [isFetching, setIsFetching] = useState({
    trackSearch: false,
    trackUpload: false,
    playlistUpload: false,
    apiKeys: false,
    userProfile: false,
  });
  const [selectedTrackIds, setSelectedTrackIds] = useState({});
  const [apiKeys, setApiKeys] = useState();
  const [accessTokens, setAccessTokens] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [fetchedTracks, setFetchedTracks] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [userIds, setUserIds] = useState("");
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const clientSecretInputRef = useRef(null);
  const clientIdInputRef = useRef(null);

  useEffect(() => {
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
        accessToken: accessTokens.spotify_search,
        isFetching: {
          name: "trackSearch",
          state: isFetching.trackSearch,
        },
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

  const onPlaylistUpload = async ({ playlist_name }) => {
    const trackURIs = playlist.reduce(
      (acc, track) => [...acc, track.track_uri],
      []
    );

    try {
      const playlistId = await createPlaylist({
        access_token: accessTokens.spotify_access,
        user_id: userIds.spotify,
        playlist_name,
        isFetching: {
          name: "createPlaylist",
          state: isFetching.createPlaylist,
        },
        setIsFetching,
      });

      await addTracksToPlaylist({
        access_token: accessTokens.spotify_access,
        playlist_id: playlistId,
        track_URIs: trackURIs,
        isFetching: {
          name: "trackUpload",
          state: isFetching.trackUpload,
        },
        setIsFetching,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleGrantAccessClick = async () => {
    let clientId = clientIdInputRef.current.value;
    let clientSecret = clientSecretInputRef.current.value;

    if (!clientId || !clientSecret) {
      const fetchedApiKeys = await getApiKeys({
        url: "http://localhost:3000/api/spotify",
        isFetching: {
          name: "apiKeys",
          state: isFetching.apiKeys,
        },
        setIsFetching,
      });

      setApiKeys(fetchedApiKeys);

      clientId = fetchedApiKeys.spotify.client_id;
      clientSecret = fetchedApiKeys.spotify.client_secret;
    }

    const spotifySearchAccessTokenSettings = {
      url: `https://accounts.spotify.com/api/token`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      },
    };

    const spotitfySearchAccessToken = await getAccessToken.search({
      url: spotifySearchAccessTokenSettings.url,
      options: spotifySearchAccessTokenSettings.options,
      isFetching: {
        name: "apiKeys",
        state: isFetching.apiKeys,
      },
      setIsFetching,
    });

    setAccessTokens((prevT) => ({
      ...prevT,
      spotify_search: spotitfySearchAccessToken,
    }));

    const authHref = getAuthorizationUrl({
      scopes: "playlist-modify-public",
      client_id: clientId,
      redirect_uri: "http://localhost:3000/callback",
      response_type: "code",
    });

    window.open(authHref);

    // const aCode = await getSpotifyCodeForAccess();
    // const aToken = await getAccessToken.search();

    let isPreparingFile = true;
    let attempts = 0;

    try {
      while (isPreparingFile && attempts <= 100) {
        const res = await fetch("http://localhost:3000/isFileReady");
        await delayMS(100);
        attempts++;

        if (res.status === 200) break;
      }

      const codeRes = await fetch("http://localhost:3000/code");
      const codeData = await codeRes.json();

      const tokenRes = await fetch("http://localhost:3000/token", {
        method: "POST",
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: "http://localhost:3000/callback",
          code: codeData.code,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const tokenData = await tokenRes.json();

      const profile = await getUserProfile({
        access_token: tokenData.token,
        isFetching: {
          name: "userProfile",
          state: isFetching.userProfile,
        },
        setIsFetching,
      });

      setAccessTokens((prevA) => ({
        ...prevA,
        spotify_access: tokenData.token,
      }));
      setUserIds((prevU) => ({ ...prevU, spotify: profile.id }));
      setIsAccessGranted(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRefreshIconClick = () => {
    setPlaylist([]);
    setIsAccessGranted(false);
    setSelectedTrackIds({});
    setSearchInput("");
    setFetchedTracks([]);
  };

  useEffect(() => {
    setPlaylist((prevP) => prevP.filter((e) => selectedTrackIds[e.id]));
  }, [selectedTrackIds]);

  return (
    <Box className="relative w-full min-h-screen overflow-y-auto p-4">
      <Box
        className="absolute top-0 left-0 -z-10 w-full h-full "
        sx={{
          backgroundColor: "rgb(136,136,136)",
          background:
            "linear-gradient(318deg, rgba(136,136,136,1) 6%, rgba(230,218,139,1) 66%)",
        }}
      ></Box>
      <Box className="flex flex-row gap-4 justify-between ">
        {isAccessGranted && (
          <Box>
            <FontAwesomeIcon
              icon={faSyncAlt}
              className="hover:cursor-pointer hover:text-red-700"
              onClick={handleRefreshIconClick}
            />
          </Box>
        )}
        <Typography variant="h4" className="text-center w-full">
          PLAYLIST MAKER
        </Typography>
        <Box></Box>
      </Box>

      <Box className="flex items-center flex-col gap-4">
        {!isAccessGranted && (
          <Box className="flex flex-col gap-4">
            <Box className="flex gap-4 flex-row">
              <TextField
                placeholder="CLIENT ID"
                inputRef={clientIdInputRef}
              ></TextField>
              <TextField
                placeholder="CLIENT SECRET"
                inputRef={clientSecretInputRef}
              ></TextField>
            </Box>
            <Box className="flex flex-col">
              <Button onClick={handleGrantAccessClick}>GRANT ACCESS</Button>
            </Box>
          </Box>
        )}
        {isAccessGranted && (
          <Box className="w-full flex flex-col gap-4">
            <TextField
              placeholder="SEARCH SONG NAME"
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
          </Box>
        )}
        {Object.values(isFetching).find((value) => value) && (
          <Box className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <CircularProgress></CircularProgress>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;
