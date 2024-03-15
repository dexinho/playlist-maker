import fecthData from "./fetchData";

const getAccessToken = {
  spotify: {},
  tidal: {},
};

const spotifyAccessTokenSearch = async ({
  clientId,
  clientSecret,
  isFetching,
  setIsFetching,
}) => {
  console.log(clientId, clientSecret)
  const url = `https://accounts.spotify.com/api/token`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
  };
  try {
    const res = await fecthData({
      url,
      options,
      isFetching,
      setIsFetching,
    });

    if (res.ok) {
      const data = await res.json();

      console.log(data)

      return data.access_token;
    }
  } catch (err) {
    console.log(err);
  }
};

const spotifyAccessTokenAccess = async ({
  clientId,
  clientSecret,
  spotifyAccessCode,
  isFetching,
  setIsFetching,
}) => {
  try {
    const url = "http://localhost:3000/token";
    const options = {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "http://localhost:3000/callback",
        code: spotifyAccessCode,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = await fecthData({ url, options, isFetching, setIsFetching });

    if (res.ok) {
      const data = await res.json();

      console.log(data);
      return data.token;
    }
  } catch (err) {
    console.log(err);
  }
};

getAccessToken.spotify.search = spotifyAccessTokenSearch;
getAccessToken.spotify.access = spotifyAccessTokenAccess;

export default getAccessToken;
