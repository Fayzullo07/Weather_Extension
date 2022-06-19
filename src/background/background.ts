import { getStoredCities, getStoredOptions, setStorageCities, setStoredOptions } from '../utils/storage';
import { fetchOpenWeatherData } from '../utils/api';

chrome.runtime.onInstalled.addListener(() => {
  setStorageCities([]);
  setStoredOptions({
    hasAutoOverlay: true,
    homeCity: "Tashkent",
    tempScale: 'metric'
  });

  chrome.contextMenus.create({
    contexts: ['selection'],
    title: "Add city to weather extension",
    id: 'weatherExtesion'
  });

  chrome.alarms.create({
    periodInMinutes: 1 / 60
  })
});

chrome.contextMenus.onClicked.addListener((event) => {
  getStoredCities().then((cities) => {
    setStorageCities([...cities, event.selectionText])
  });
});

chrome.alarms.onAlarm.addListener(() => {
  getStoredOptions().then((options) => {
    if(options.homeCity === "") {
      return
    }
    fetchOpenWeatherData(options.homeCity, options.tempScale).then((data) => {
      const symbol = options.tempScale === "metric" ? '\u2103' : '\u2109';
      chrome.action.setBadgeText({
        text: `${ Math.round(data.main.temp)} ${symbol}`
      });
    })
  })
})
