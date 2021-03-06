import React, { useEffect, useState } from "react";
import "./WeatherCard.css";

// Material UI Components
import { Card, CardContent, Typography, Box, CardActions, Button, Grid } from "@mui/material";

// Api
import {getWeatherIconSrc, fetchOpenWeatherData, OpenWeatherData, OpenWeatherTempScale } from "../../utils/api";

const WeatherCardContainer: React.FC<{children: React.ReactNode, onDelete?: () => void}> = ({children, onDelete}) => {
  return (
    <Box mx={'4px'} my={'16px'}>
      <Card>
        <CardContent>{children}</CardContent>
        <CardActions>
          {onDelete && <Button onClick={onDelete}>
              <Typography className="weatherCard-body">Delete</Typography>
            </Button>}
        </CardActions>
      </Card>
    </Box>
  )
};

type WeatherCardState = "loading" | "error" | "ready";

const WeatherCard: React.FC<{ city: string, tempScale: OpenWeatherTempScale, onDelete?: () => void }> = ({ city, tempScale, onDelete }) => {
  const [weatehrData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [cardState, setCardState] = useState<WeatherCardState>("loading");
  useEffect(() => {
    fetchOpenWeatherData(city, tempScale)
      .then((data) => {
        setWeatherData(data);
        setCardState("ready");
      })
      .catch((err) => setCardState("error"));
  }, [city, tempScale]);

  if(cardState == "loading" || cardState == "error"){
    return (
      <WeatherCardContainer onDelete={onDelete}>
        <Typography className="weatherCard-title">{city}</Typography>
        <Typography className="weatherCard-body">
          {cardState == "loading" ? "Loading . . . " : "Error: could not retrieve weather data for this city"}
        </Typography>
      </WeatherCardContainer>
    )
  }

  return (
    <WeatherCardContainer onDelete={onDelete}>
      <Grid container justifyContent="space-around">
        <Grid item>
          <Typography className="weatherCard-title">{weatehrData.name}</Typography>
          <Typography className="weatherCard-temp">{Math.round(weatehrData.main.temp)}</Typography>
          <Typography className="weatherCard-body">Feel like: {Math.round(weatehrData.main.feels_like)}</Typography>
          <Typography className="weatherCard-body">Max: {Math.round(weatehrData.main.temp_max)} || Min: {Math.round(weatehrData.main.temp_min)}</Typography>
        </Grid>
        <Grid item>
          {weatehrData.weather.length > 0 && (
            <>
              <img src={getWeatherIconSrc(weatehrData.weather[0].icon)} />
              <Typography className="weatherCard-body">{weatehrData.weather[0].main}</Typography>
            </>
          )}
        </Grid>
      </Grid>
    </WeatherCardContainer>
        
  );
};

export default WeatherCard;
