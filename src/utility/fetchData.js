const fecthData = async ({isFetching, setIsFetching, url, options}) => {
  if (isFetching) return

  try {
    setIsFetching(true)
    const response = await fetch(url, options)

    return response
  } catch (err) {
    console.log(err)
  } finally {
    setIsFetching(false)
  }
}

export default fecthData