import fecthData from "./fetchData";

const getCode = {
  spotify: {},
  tidal: {},
};

const spotifyCodeAccess = async ({ isFetching, setIsFetching }) => {
  const url = "http://localhost:3000/code";
  try {
    const res = await fecthData({
      url,
      isFetching,
      setIsFetching,
    });

    if (res.ok) {
      const data = await res.json();

      return data.code;
    }
  } catch (err) {
    console.log(err);
  }
};

getCode.spotify.access = spotifyCodeAccess;

export default getCode;
