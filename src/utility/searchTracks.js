import fecthData from "./fetchData";

const searchTracks = async ({
  url,
  accessToken,
  isFetching,
  setIsFetching,
}) => {
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

export default searchTracks;
