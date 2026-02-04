import React, { useState } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning, MapPin, Umbrella } from 'lucide-react';
import styles from './Weather.module.css';
import { LocationModal } from '../LocationModal/LocationModal';

const getWeatherIcon = (code: number) => {
    const size = 64;
    // TODO: Replace with Pixel Art Icons or use specific colors
    if (code === 0) return <Sun size={size} className={styles.icon} color="#ffd700" />; // Gold Sun
    if (code >= 1 && code <= 3) return <Cloud size={size} className={styles.icon} color="#aaa" />;
    if (code >= 45 && code <= 48) return <CloudFog size={size} className={styles.icon} color="#888" />;
    if (code >= 51 && code <= 67) return <CloudRain size={size} className={styles.icon} color="#4ade80" />; // Matrix Rain Green
    if (code >= 71 && code <= 77) return <CloudSnow size={size} className={styles.icon} color="#fff" />;
    if (code >= 80 && code <= 82) return <CloudRain size={size} className={styles.icon} color="#4ade80" />;
    if (code >= 95) return <CloudLightning size={size} className={styles.icon} color="#ffff00" />;
    return <Sun size={size} className={styles.icon} />;
};

export const Weather: React.FC = () => {
    const { weather, updateLocation, setLocation } = useWeather();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!weather) return <div className={styles.container}>LOADING...</div>;

    const current = weather.current;
    // OWM Daily array: 0=Today, 1=Tomorrow, 2=Day After
    const tomorrowIdx = 1;
    const dayAfterIdx = 2;

    // Use OWM description if available, else fallback code mapping
    const conditionText = current.description || 'Unknown';

    return (
        <>
            <div className={styles.container}>
                <div className={styles.location} onClick={() => setIsModalOpen(true)}>
                    <MapPin size={20} />
                    {weather.locationName || 'Unknown'}
                </div>

                <div className={styles.current}>
                    <div className={styles.tempBox}>
                        <span className={styles.temp}>{Math.round(current.temperature_2m)}°</span>
                        <span className={styles.condition}>
                            {conditionText}
                            {current.relative_humidity_2m > 0 && ` / ${current.relative_humidity_2m}%`}
                        </span>
                        <span className={styles.todayRange}>
                            L:{Math.round(weather.daily.temperature_2m_min[0])}° H:{Math.round(weather.daily.temperature_2m_max[0])}°
                        </span>
                    </div>
                    {getWeatherIcon(current.weather_code)}
                </div>

                <div className={styles.forecast}>
                    <div className={styles.day}>
                        <span className={styles.dayLabel}>TOM</span>
                        <div className={styles.minmax}>
                            {Math.round(weather.daily.temperature_2m_max[tomorrowIdx])}° / {Math.round(weather.daily.temperature_2m_min[tomorrowIdx])}°
                        </div>
                        {weather.daily.precipitation_probability_max[tomorrowIdx] > 20 && (
                            <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>
                                <Umbrella size={12} style={{ display: 'inline' }} /> {weather.daily.precipitation_probability_max[tomorrowIdx]}%
                            </div>
                        )}
                    </div>
                    <div className={styles.day}>
                        <span className={styles.dayLabel}>DAT</span>
                        <div className={styles.minmax}>
                            {Math.round(weather.daily.temperature_2m_max[dayAfterIdx])}° / {Math.round(weather.daily.temperature_2m_min[dayAfterIdx])}°
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <LocationModal
                    onClose={() => setIsModalOpen(false)}
                    onSelectLocation={setLocation}
                    onSearch={updateLocation}
                />
            )}
        </>
    );
};
