import fecthData from "./fetchData";

const getAccessToken = {};

const getAccessTokenForSearch = async ({
  url,
  options,
  isFetching,
  setIsFetching,
}) => {
  try {
    const res = await fecthData({
      url,
      options,
      isFetching,
      setIsFetching,
    });

    if (res.ok) {
      const data = await res.json();

      console.log(data);

      return data.access_token;
    }
  } catch (err) {
    console.log(err);
  }
};

async function getAccessTokenForPlaylist({
  code,
  client_id,
  client_secret,
  redirect_uri,
}) {
  const auth = base64Encode(`${client_id}:${client_secret}`);

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  const body = params.toString();

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: 1,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: 1,
  });

  const data = await response.json();
  return data.access_token;
}

function base64Encode(str) {
  const encodedString = btoa(str);
  return encodedString;
}

getAccessToken.search = getAccessTokenForSearch;
getAccessToken.access = getAccessTokenForPlaylist;

export default getAccessToken;
