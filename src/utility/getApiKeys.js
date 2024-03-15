import fecthData from "./fetchData";

const getApiKeys = async ({ isFetching, setIsFetching }) => {
  try {
    const url = "http://localhost:3000/api/spotify";
    const res = await fecthData({ url, isFetching, setIsFetching });

    if (res.ok) {
      const apiKeys = await res.json();

      return apiKeys;
    }
  } catch (err) {
    console.log(err);
  }
};

export default getApiKeys;
