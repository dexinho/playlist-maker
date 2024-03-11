import queryString from "querystring";

async function getAccessTokenForPlaylist({
  code,
  client_id,
  client_secret,
  redirect_uri,
}) {
  // Encode client ID and client secret to Base64
  const auth = base64Encode(`${client_id}:${client_secret}`);

  // Construct request body
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirect_uri);
  const body = params.toString();

  // console.log(body);
  // console.log(auth);

  // Make request to token endpoint
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: 1,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: 1
  });

  // Parse response and return access token
  const data = await response.json();
  return data.access_token;
}

// Function to encode string to Base64
function base64Encode(str) {
  const encodedString = btoa(str);
  return encodedString;
}

export default getAccessTokenForPlaylist;
