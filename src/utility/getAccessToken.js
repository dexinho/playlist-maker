import fecthData from "./fetchData";

const getAccessToken = async ({ url, options, isFetching, setIsFetching }) => {
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

export default getAccessToken;


