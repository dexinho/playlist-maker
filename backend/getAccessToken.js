import queryString from 'querystring'

async function getAccessToken({client_id, client_secret, redirect_uri, code}) {
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const body = queryString.stringify({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: redirect_uri,
  });
  
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await response.json();

  return data.access_token;
}

export default getAccessToken