import { IconButton, InputBase, Paper, Box, Grid } from "@mui/material";
import { Search, PictureInPicture } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./popup.css";
import WeatherCard from "../components/WeatherCard";

// Utils
import { setStorageCities, getStoredCities, setStoredOptions, getStoredOptions, LocalStorageOptions } from "../utils/storage";
import { Message } from '../utils/message';

const App: React.FC<{}> = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [cityInput, setCityInput] = useState<string>('');
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);

  useEffect(() => {
    getStoredCities().then((cities) => setCities(cities));
    getStoredOptions().then((options) => setOptions(options));
  }, [])

  const handleCityClick = () => {
    if(cityInput === ""){
      return
    }

    const updatedCities = [...cities, cityInput];
    setStorageCities(updatedCities)
      .then(() => {
        setCities(updatedCities);
        setCityInput("");
      })
  };

  const handleCityDeleteClick = (index: number) => {
    cities.splice(index, 1);
    const updatedCities = [...cities];
    setStorageCities(updatedCities)
      .then(() => {
        setCities(updatedCities);
      })
  };

  const handleTempScaleClick = () => {
    const updatedOptions: LocalStorageOptions = {
      ...options,
      tempScale: options.tempScale === "metric" ? "imperial" : "metric" 
    }
    
    setStoredOptions(updatedOptions).then(() => setOptions(updatedOptions));
  };

  const handleOverlayButtonClick = () => {
    chrome.tabs.query({
      active: true
    }, (tabs) => {
      if(tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, Message.TOGGLE_OVERLAY)
      }
    })
  }

  if(!options){
    return null
  }
  
  return (
    <Box mx="8px" my="16px">
      <Grid container justifyContent='space-evenly'>
        <Grid item >
          <Paper>
            <Box px='15px' py='5px'>
              <InputBase 
                placeholder="Add a city name"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                />
              <IconButton onClick={handleCityClick}>
                <Search/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py='3px'>
              <IconButton onClick={handleTempScaleClick}>
                {options.tempScale === 'metric' ? '\u2103' : '\u2109'}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <Box py='5px'>
              <IconButton onClick={handleOverlayButtonClick}>
                <PictureInPicture/>
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {options.homeCity != "" && <WeatherCard onDelete={() => {}} city={options.homeCity} tempScale={options.tempScale}/>}
      {cities.map((city, index) => <WeatherCard tempScale={options.tempScale} city={city} onDelete={() => handleCityDeleteClick(index)} key={index}/>).reverse()}
    </Box>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);
