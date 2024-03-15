import fecthData from "./fetchData";

const createPlaylist = {};

async function createSpotifyPlaylist({
  accessToken,
  user_id,
  playlist_name,
  isFetching,
  setIsFetching,
}) {
  try {
    const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlist_name,
        public: true,
      }),
    };

    const response = await fecthData({
      url,
      options,
      isFetching,
      setIsFetching,
    });

    const data = await response.json();

    return data.id;
  } catch (err) {
    console.log(err);
  }
}

createPlaylist.spotify = createSpotifyPlaylist;

export default createPlaylist;
