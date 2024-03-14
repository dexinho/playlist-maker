const fecthData = async ({ isFetching, setIsFetching, url, options }) => {
  if (isFetching.state) return;

  try {
    setIsFetching((prevF) => ({ ...prevF, [isFetching.name]: true }));
    const response = await fetch(url, options);

    return response;
  } catch (err) {
    console.log(err);
  } finally {
    setIsFetching((prevF) => ({ ...prevF, [isFetching.name]: false }));
  }
};

export default fecthData;
