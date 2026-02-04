import { useState, useEffect } from 'react';
import { fetchData } from '../services/api';

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        weather_code: number;
        apparent_temperature: number;
        precipitation: number;
        description: string;
        icon: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
        precipitation_probability_max: number[];
    };
    locationName?: string;
}

const API_KEY = '1ce0ed48f88ecbd02ccc8090ab86e20f'; // User provided key
const DEFAULT_LAT = 37.5665;
const DEFAULT_LON = 126.9780;
const STORAGE_KEY = 'smart_clock_location';

// Map OWM Condition Codes to unified code system (0-99 similar to WMO)
// or just return the text description for the Retro UI
const mapOwmToWmo = (id: number): number => {
    if (id === 800) return 0; // Clear
    if (id >= 801 && id <= 804) return 1; // Clouds
    if (id >= 700 && id < 800) return 45; // Fog/Atmosphere
    if (id >= 600 && id < 700) return 71; // Snow
    if (id >= 500 && id < 600) return 61; // Rain
    if (id >= 300 && id < 400) return 51; // Drizzle
    if (id >= 200 && id < 300) return 95; // Thunder
    return 3;
};

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const fetchWeather = async (lat: number, lon: number, locationName?: string) => {
        try {
            // 1. Current Weather
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`;
            const currentData = await fetchData<any>(currentUrl);

            // 2. Forecast (5 day / 3 hour)
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=kr&appid=${API_KEY}`;
            const forecastData = await fetchData<any>(forecastUrl);

            if (currentData && forecastData) {
                // Process Forecast to get daily Min/Max
                // OWM Free forecast returns 3-hour steps. We need to aggregate by day.
                const dailyMap = new Map<string, { min: number, max: number, codes: number[], pops: number[] }>();

                forecastData.list.forEach((item: any) => {
                    const date = item.dt_txt.split(' ')[0];
                    if (!dailyMap.has(date)) {
                        dailyMap.set(date, { min: 100, max: -100, codes: [], pops: [] });
                    }
                    const day = dailyMap.get(date)!;
                    day.min = Math.min(day.min, item.main.temp_min);
                    day.max = Math.max(day.max, item.main.temp_max);
                    day.codes.push(item.weather[0].id);
                    day.pops.push(item.pop); // Probability of Precipitation (0-1)
                });

                const days = Array.from(dailyMap.keys()).slice(0, 3); // Today, Tomorrow, Day after (approx)
                // Note: 'Today' in forecast might be partial. OWM Forecast starts from "now".

                const daily = {
                    time: days,
                    temperature_2m_max: days.map(d => dailyMap.get(d)!.max),
                    temperature_2m_min: days.map(d => dailyMap.get(d)!.min),
                    weather_code: days.map(d => mapOwmToWmo(dailyMap.get(d)!.codes[Math.floor(dailyMap.get(d)!.codes.length / 2)])),
                    precipitation_probability_max: days.map(d => Math.round(Math.max(...dailyMap.get(d)!.pops) * 100)),
                };

                const mappedData: WeatherData = {
                    current: {
                        temperature_2m: currentData.main.temp,
                        relative_humidity_2m: currentData.main.humidity,
                        weather_code: mapOwmToWmo(currentData.weather[0].id),
                        apparent_temperature: currentData.main.feels_like,
                        precipitation: 0, // Current rain volume not always avail in simple helper, using description for now? OWM has 'rain.1h'
                        description: currentData.weather[0].description,
                        icon: currentData.weather[0].icon,
                    },
                    daily,
                    locationName: locationName || currentData.name,
                };

                setWeather(mappedData);
            }
        } catch (e) {
            console.error("OWM Fetch failed", e);
        }
    };

    const updateLocation = async (query: string) => {
        try {
            // OWM Geocoding API is included in free tier usually
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`;
            const result = await fetchData<Array<{
                name: string;
                lat: number;
                lon: number;
                country: string;
                state?: string;
                local_names?: { ko?: string };
            }>>(geoUrl);

            if (result && result.length > 0) {
                // Prefer Korea results if query implies it, but OWM search is simple.
                // Just take best match.
                const place = result[0];
                const displayName = place.local_names?.ko || place.name;
                const fullDisplayName = `${displayName} ${place.state ? `(${place.state})` : ''}`;

                localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat: place.lat, lon: place.lon, name: fullDisplayName }));
                fetchWeather(place.lat, place.lon, fullDisplayName);
                return true;
            }
            return false;
        } catch (e) {
            console.error("OWM Geocoding failed", e);
            return false;
        }
    };

    const setLocation = (lat: number, lon: number, name: string) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ lat, lon, name }));
        fetchWeather(lat, lon, name);
    };

    useEffect(() => {
        const initLocation = async () => {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { lat, lon, name } = JSON.parse(saved);
                fetchWeather(lat, lon, name);
                return;
            }
            // Default Fallback
            fetchWeather(DEFAULT_LAT, DEFAULT_LON, '서울 (기본)');
        };

        initLocation();
        const interval = setInterval(() => initLocation(), 10 * 60 * 1000); // 10 mins (Allowed for free tier? 60 calls/min. 1 call every 10 min is fine)

        return () => clearInterval(interval);
    }, []);

    return { weather, updateLocation, setLocation };
};
