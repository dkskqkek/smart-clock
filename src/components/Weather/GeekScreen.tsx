import React, { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning, Thermometer, Droplets, Wifi } from 'lucide-react';
import styles from './GeekScreen.module.css';
import { LocationModal } from '../LocationModal/LocationModal';

const getWeatherIcon = (code: number) => {
    const size = 100;
    // Use solid colors to match the photo's icon style (often simple graphics)
    if (code === 0) return <Sun size={size} color="#ff9500" strokeWidth={2} />;
    if (code >= 1 && code <= 3) return <Cloud size={size} color="#ddd" strokeWidth={2} />;
    if (code >= 45 && code <= 48) return <CloudFog size={size} color="#aaa" strokeWidth={2} />;
    if (code >= 51 && code <= 67) return <CloudRain size={size} color="#0ff" strokeWidth={2} />;
    if (code >= 71 && code <= 77) return <CloudSnow size={size} color="#fff" strokeWidth={2} />;
    if (code >= 80 && code <= 82) return <CloudRain size={size} color="#0ff" strokeWidth={2} />;
    if (code >= 95) return <CloudLightning size={size} color="#ff0" strokeWidth={2} />;
    return <Sun size={size} color="#ff9500" />;
};

export const GeekScreen: React.FC = () => {
    const { weather, updateLocation, setLocation } = useWeather();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Formats
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    // 2026/2/4 Wed
    const dateStr = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.toLocaleDateString('en-US', { weekday: 'short' })}`;

    if (!weather) return <div className={styles.screen}>INITIALIZING...</div>;

    const current = weather.current;

    // Calculate Bar Widths (Visual Only)
    // Temp: -10 to 40 range assumed
    const tempPercent = Math.min(100, Math.max(0, ((current.temperature_2m + 10) / 50) * 100));
    // Hum: 0 to 100
    const humPercent = current.relative_humidity_2m;

    return (
        <div className={styles.screen}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.locationInfo} onClick={() => setIsModalOpen(true)}>
                    <span className={styles.city}>{weather.locationName?.split(' ')[0] || 'SEOUL'}</span>
                    <span className={styles.countryBox}>KR</span>
                </div>
                <div className={styles.networkInfo}>
                    <Wifi size={18} style={{ display: 'inline', marginRight: 4 }} />
                    192.168.0.x
                </div>
            </div>

            {/* Main Center */}
            <div className={styles.mainContent}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                    <div className={styles.weatherText}>{current.description}</div>
                    <div className={styles.clockRow} style={{ justifyContent: 'center' }}>
                        <span className={styles.time}>{hours}:{minutes}</span>
                        <span className={styles.seconds}>{seconds}</span>
                    </div>
                </div>

                <div className={styles.dateRow}>
                    {dateStr}
                </div>
            </div>

            {/* Bottom Stats */}
            <div className={styles.bottomArea}>
                <div className={styles.statsCol}>
                    <div className={styles.statItem}>
                        <Thermometer size={24} color="#ff3333" />
                        <div className={styles.barContainer}>
                            <div className={`${styles.barFill} ${styles.tempFill}`} style={{ width: `${tempPercent}%` }}></div>
                        </div>
                        <span className={styles.statValue}>{Math.round(current.temperature_2m)}°</span>
                    </div>
                    <div className={styles.statItem}>
                        <Droplets size={24} color="#00ffff" />
                        <div className={styles.barContainer}>
                            <div className={`${styles.barFill} ${styles.humFill}`} style={{ width: `${humPercent}%` }}></div>
                        </div>
                        <span className={styles.statValue}>{current.relative_humidity_2m}%</span>
                    </div>
                </div>

                <div className={styles.weatherIconCol}>
                    {getWeatherIcon(current.weather_code)}
                </div>
            </div>

            {isModalOpen && (
                <LocationModal
                    onClose={() => setIsModalOpen(false)}
                    onSelectLocation={setLocation}
                    onSearch={updateLocation}
                />
            )}
        </div>
    );
};
