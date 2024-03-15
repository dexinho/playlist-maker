import fecthData from "./fetchData";

const searchTracks = {};

const searchTracksSpotify = async ({
  searchInput,
  accessToken,
  isFetching,
  setIsFetching,
}) => {
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
    searchInput
  )}&type=track`;
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

    return data.tracks.items;
  }
};

searchTracks.spotify = searchTracksSpotify;

export default searchTracks;
