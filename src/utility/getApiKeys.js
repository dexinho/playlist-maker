import fecthData from "./fetchData";

const getApiKeys = async ({ url, isFetching, setIsFetching }) => {
  try {
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
