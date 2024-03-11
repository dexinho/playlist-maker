async function createPlaylist({ access_token, user_id, playlist_name }) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlist_name,
          public: true,
        }),
      }
    );

    const data = await response.json();
    return data.id;
  } catch (err) {
    console.log(err);
  }
}

export default createPlaylist;
