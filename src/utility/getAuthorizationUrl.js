import queryString from "querystring";

const getAuthorizationUrl = ({client_id, scopes, redirect_uri, response_type}) => {
  const params = {
    client_id,
    response_type,
    redirect_uri,
    scope: scopes,
  };
  const authUrl = `https://accounts.spotify.com/authorize?${queryString.stringify(
    params
  )}`;

  return authUrl;
};

export default getAuthorizationUrl;