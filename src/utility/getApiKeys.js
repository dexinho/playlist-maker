import fecthData from "./fetchData";

const getApiKeys = async ({ url, setApiKeys, isFetching, setIsFetching }) => {
  try {
    const res = await fecthData({ url, isFetching, setIsFetching });

    if (res.ok) {
      const apiKeys = await res.json();

      console.log("apiKeys", apiKeys);

      setApiKeys(apiKeys);

      return apiKeys;
    }
  } catch (err) {
    console.log(err);
  }
};

export default getApiKeys;
