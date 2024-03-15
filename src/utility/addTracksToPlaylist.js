import fecthData from "./fetchData";

const addTracksToPlaylist = async ({
  accessToken,
  playlist_id,
  track_URIs,
  isFetching,
  setIsFetching,
}) => {
  const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: track_URIs,
    }),
  };

  const response = await fecthData({ url, options, isFetching, setIsFetching });

  return response;
};

export default addTracksToPlaylist;
