import queryString from "querystring";

const authorizationUrl = {};

const getSpotifyAuthorizationUrl = ({
  clientId,
  scopes,
  redirect_uri,
  response_type,
}) => {
  const params = {
    client_id: clientId,
    response_type,
    redirect_uri,
    scope: scopes,
  };
  const authUrl = `https://accounts.spotify.com/authorize?${queryString.stringify(
    params
  )}`;

  return authUrl;
};

authorizationUrl.spotify = getSpotifyAuthorizationUrl;

export default authorizationUrl;
