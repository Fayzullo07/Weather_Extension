import { setStorageCities, setStoredOptions } from '../utils/storage';

chrome.runtime.onInstalled.addListener(() => {
  setStorageCities([]);
  setStoredOptions({
    hasAutoOverlay: true,
    homeCity: "Tashkent",
    tempScale: 'metric'
  });
});
