async function getAccessTokenForPlaylist({
  code,
  client_id,
  client_secret,
  redirect_uri,
}) {
  try {
    const auth = btoa(`${client_id}:${client_secret}`);
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    }).toString(); // Convert URLSearchParams to string
    
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body, // Pass the stringified body
    });

    // Check if the response is not OK (status code >= 400)
    if (!response.ok) {
      throw new Error(`Failed to obtain access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.message);
    throw error;
  }
}

export default getAccessTokenForPlaylist;
