import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import './options.css'

// Material UI Component
import {Box, Button, Card, CardContent, Grid, Switch, TextField, Typography} from '@mui/material';


// Utils 
import { setStoredOptions, LocalStorageOptions, getStoredOptions } from '../utils/storage';

type FormState = 'ready' | 'saving';

const App: React.FC<{}> = () => {
  const [options, setOptions] = useState<LocalStorageOptions | null>(null);
  const [formState, setFormState] = useState<FormState>('ready');

  useEffect(() => {
    getStoredOptions().then((options) => setOptions(options));
    
  }, []);

  const handleHomeCityOptions = (homeCity: string) => {
    setOptions({
      ...options,
      homeCity
    })
  };
  
  const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
    setOptions({
      ...options,
      hasAutoOverlay
    });
  };

  const handleSaveButtonClick = () => {
    setFormState("saving");
    setStoredOptions(options).then(() => {
      setTimeout(() => {
        setFormState("ready");
      }, 1000);
    });
  };

  if(!options) {
    return null;
  }

  const isFieldsDisabled = formState === 'saving';

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction='column' spacing={4}>
            <Grid item>
              <Typography variant='h4'>Weather Extention Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant='body1'>Home City Name</Typography>
              <TextField 
                fullWidth 
                variant='standard' 
                label='City' 
                placeholder='Enter a home city' 
                value={options.homeCity}
                onChange={(e) => handleHomeCityOptions(e.target.value)}
                />
            </Grid>
            <Grid item>
              <Typography variant='body1'>Auto toggle overlay on webpage load</Typography>
              <Switch 
                color='primary' 
                checked={options.hasAutoOverlay}
                onChange={(e, checked) => handleAutoOverlayChange(checked)}
                disabled={isFieldsDisabled}
                />
            </Grid>
            <Grid item>
              <Button 
                variant='contained' 
                color='success'
                onClick={handleSaveButtonClick}
                disabled={isFieldsDisabled}>
                  {formState === "ready" ? "Save" : "Saving . . ."}
                </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
