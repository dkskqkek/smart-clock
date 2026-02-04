import React, { useState, useEffect } from 'react';
import { useWeather } from '../../hooks/useWeather';
import { useFinance, type FinanceItem } from '../../hooks/useFinance';
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning } from 'lucide-react';
import styles from './ModernScreen.module.css';

const getWeatherIcon = (code: number) => {
    const size = "20vmin";
    // Modern standard colors
    if (code === 0) return <Sun size={size} color="#fcd34d" fill="#fcd34d" strokeWidth={1.5} className={styles.weatherIcon} />; // Yellow filled
    if (code >= 1 && code <= 3) return <Cloud size={size} color="#e5e7eb" fill="#e5e7eb" strokeWidth={1.5} className={styles.weatherIcon} />;
    if (code >= 45 && code <= 48) return <CloudFog size={size} color="#9ca3af" fill="#9ca3af" strokeWidth={1.5} className={styles.weatherIcon} />;
    if (code >= 51 && code <= 67) return <CloudRain size={size} color="#60a5fa" fill="#60a5fa" strokeWidth={1.5} className={styles.weatherIcon} />;
    if (code >= 71 && code <= 77) return <CloudSnow size={size} color="#ffffff" fill="#ffffff" strokeWidth={1.5} className={styles.weatherIcon} />;
    if (code >= 80 && code <= 82) return <CloudRain size={size} color="#60a5fa" fill="#60a5fa" strokeWidth={1.5} className={styles.weatherIcon} />;
    if (code >= 95) return <CloudLightning size={size} color="#fcd34d" fill="#fcd34d" strokeWidth={1.5} className={styles.weatherIcon} />;
    return <Sun size={size} color="#fcd34d" className={styles.weatherIcon} />;
};

const FinanceCard = ({ item }: { item: FinanceItem }) => {
    const isUp = item.change >= 0;
    return (
        <div className={styles.financeItem}>
            <div className={styles.finName}>{item.name}</div>
            <div className={styles.finPrice}>
                {item.currency === 'USD' ? '$' : ''}
                {item.price.toLocaleString()}
            </div>
            <div className={`${styles.finChange} ${isUp ? styles.up : styles.down}`}>
                {isUp ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)}%
            </div>
        </div>
    );
};

export const ModernScreen: React.FC = () => {
    const { weather } = useWeather();
    const financeData = useFinance();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Time: 10:31
    const timeStr = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    // Date: Wed, Feb 4
    const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className={styles.screen}>
            {/* Left: Weather Card */}
            <div className={`${styles.card} ${styles.weatherCard}`}>
                {weather ? (
                    <>
                        {getWeatherIcon(weather.current.weather_code)}
                        <div className={styles.temp}>{Math.round(weather.current.temperature_2m)}°</div>
                        <div className={styles.condition}>
                            {weather.current.description}<br />
                            {weather.locationName?.split(' ')[0]}
                        </div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>

            {/* Right: Clock & Finance */}
            <div className={styles.rightCol}>
                <div className={styles.clockArea}>
                    <div className={styles.time}>{timeStr}</div>
                    <div className={styles.date}>{dateStr}</div>
                </div>

                <div className={styles.financeGrid}>
                    {/* Render specific items in order: KOSPI, Gold, BTC, NASDAQ */}
                    {/* Find items from hook data. This assumes hook returns [KOSPI, NASDAQ, BTC, Gold] or similar order. 
                        Let's map safely. 
                    */}
                    {['KOSPI', 'Gold', 'Bitcoin', 'NASDAQ'].map(symbolName => {
                        const item = financeData.find(f => f.name === symbolName || f.symbol === symbolName);
                        if (!item) return <div key={symbolName} className={styles.financeItem}> Loading... </div>;
                        return <FinanceCard key={symbolName} item={item} />;
                    })}
                </div>
            </div>
        </div>
    );
};
