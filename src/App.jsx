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
import authorizationUrl from "./utility/authorizationUrl";
import addTracksToPlaylist from "./utility/addTracksToPlaylist";
import delayMS from "./utility/delayMS";
import getCode from "./utility/getCode";
import userProfile from "./utility/userProfile";
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
    //       clientId: process.env["TIDAL_clientId"],
    //       clientSecret: process.env["TIDAL_clientSecret"],
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
      const spotifyFoundTracks = await searchTracks.spotify({
        searchInput,
        accessToken: accessTokens.spotifySearch,
        isFetching: {
          name: "trackSearch",
          state: isFetching.trackSearch,
        },
        setIsFetching,
      });

      setFetchedTracks(
        spotifyFoundTracks.reduce(
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
      const playlistId = await createPlaylist.spotify({
        user_id: userIds.spotify,
        playlist_name,
        accessToken: accessTokens.spotify_access,
        isFetching: {
          name: "createPlaylist",
          state: isFetching.createPlaylist,
        },
        setIsFetching,
      });

      await addTracksToPlaylist({
        playlist_id: playlistId,
        track_URIs: trackURIs,
        accessToken: accessTokens.spotify_access,
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
      const fetchedApiKeys = await getApiKeys.spotify({
        isFetching: {
          name: "apiKeys",
          state: isFetching.apiKeys,
        },
        setIsFetching,
      });

      clientId = fetchedApiKeys.spotify.clientId;
      clientSecret = fetchedApiKeys.spotify.clientSecret;

      setApiKeys((prevA) => ({
        ...prevA,
        spotify: { clientId, clientSecret },
      }));
    }

    const spotitfySearchAccessToken = await getAccessToken.spotify.search({
      clientId,
      clientSecret,
      isFetching: {
        name: "apiKeys",
        state: isFetching.apiKeys,
      },
      setIsFetching,
    });

    setAccessTokens((prevT) => ({
      ...prevT,
      spotifySearch: spotitfySearchAccessToken,
    }));

    const authHref = authorizationUrl.spotify({
      scopes: "playlist-modify-public",
      clientId,
      redirect_uri: "http://localhost:3000/callback",
      response_type: "code",
    });

    window.open(authHref);

    let isPreparingFile = true;
    let attempts = 0;

    try {
      while (isPreparingFile && attempts <= 100) {
        const res = await fetch("http://localhost:3000/isFileReady");
        await delayMS(100);
        attempts++;

        if (res.status === 200) break;
      }

      const spotifyAccessCode = await getCode.spotify.access({
        isFetching: {
          name: "apiKeys",
          isFetching: isFetching.apiKeys,
        },
        setIsFetching,
      });

      const spotifyAccessTokenAccess = await getAccessToken.spotify.access({
        clientId,
        clientSecret,
        spotifyAccessCode,
        isFetching: {
          name: "apiKeys",
          isFetching: isFetching.apiKeys,
        },
        setIsFetching,
      });

      const profile = await userProfile.spotify({
        accessToken: spotifyAccessTokenAccess,
        isFetching: {
          name: "userProfile",
          state: isFetching.userProfile,
        },
        setIsFetching,
      });

      setAccessTokens((prevA) => ({
        ...prevA,
        spotify_access: spotifyAccessTokenAccess,
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
