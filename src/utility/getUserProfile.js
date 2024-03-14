import fecthData from "./fetchData";

const getUserProfile = async ({ access_token, isFetching, setIsFetching }) => {
  try {
    const url = "https://api.spotify.com/v1/me";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
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

export default getUserProfile;
