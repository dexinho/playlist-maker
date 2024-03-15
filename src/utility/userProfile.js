import fecthData from "./fetchData";

const userProfile = {};

const getSpotifyUserProfile = async ({
  accessToken,
  isFetching,
  setIsFetching,
}) => {
  try {
    const url = "https://api.spotify.com/v1/me";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await fecthData({ url, options, isFetching, setIsFetching });

    if (res.ok) {
      const data = await res.json();

      return data;
    }
  } catch (err) {
    console.log(err);
  }
};

userProfile.spotify = getSpotifyUserProfile;

export default userProfile;
