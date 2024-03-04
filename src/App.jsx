import React, { useEffect, useState } from "react";
import fecthData from "./utility/fetchData";
import { TextField, Typography } from '@mui/material'

const App = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [searchInput, setSearchInput] = useState('')
  const [fetchedTracks, setFetchedTracks] = useState([])

  useEffect(() => {
    async function getAccessToken() {
      const url = `https://accounts.spotify.com/api/token`;
      const clientId = "404cae06b37c4e3897ab0dbfec5bd047";
      const clientSecret = "d3b356e7507a4cc5a44fa8fe9942f64c";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      };

      try {
        const res = await fecthData({
          url,
          options,
          isFetching,
          setIsFetching,
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.access_token);
        }
      } catch (err) {
        console.log(err);
      }
    }  

    getAccessToken();
  }, []);

  const getTrack = async (searchInput) => {
    const trackName = 'hello'
    const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      searchInput
    )}&type=track`;

    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    };

    const res = await fecthData({ url, options, isFetching, setIsFetching });

    if (res.ok) {
      const data = await res.json();
      console.log(data.tracks.items)
      setFetchedTracks(data.tracks.items);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearchKeyDown = (e) => {
    console.log(e.key)
    if (e.key === 'Enter') {
      getTrack(searchInput)
      setSearchInput('')
    }
  }

  return <div>
    <TextField onChange={handleSearchInputChange} onKeyDown={handleSearchKeyDown}></TextField>
    <Typography variant="h4">{
      fetchedTracks.map((track, index) => <div key={index}>{track.href}</div>)
    }</Typography>
  </div>;
};

export default App;
