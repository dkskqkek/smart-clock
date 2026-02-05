import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DigitalClock } from './DigitalClock';
import { WeatherWidget } from './WeatherWidget';
import { FinanceWidget } from './FinanceWidget';
import { useWeather } from '../../hooks/useWeather';
import styles from './GhibliScreen.module.css';

export const GhibliScreen: React.FC = () => {

    const getWeatherDesc = (code: number) => {
        switch (code) {
            case 0: return '맑음';
            case 1: case 2: case 3: return '구름 많음';
            case 45: case 48: return '안개/박무';
            case 51: case 53: case 55: return '이슬비';
            case 61: case 63: case 65: return '비';
            case 71: case 73: case 75: return '눈';
            case 80: case 81: case 82: return '소나기';
            case 95: case 96: case 99: return '뇌우';
            default: return '흐림';
        }
    };

    const [time, setTime] = useState(new Date());
    const { weather } = useWeather();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Today Data
    const todayTemp = weather?.current.temperature_2m || 0;
    const todayCode = weather?.current.weather_code || 0;
    const todayDesc = weather?.current.description || 'Loading...';
    const todayHumidity = weather?.current.relative_humidity_2m;
    // Current weather doesn't always have high/low for "Today", need to grab from Daily[0]
    const todayMax = weather?.daily.temperature_2m_max[0];
    const todayMin = weather?.daily.temperature_2m_min[0];

    // Tomorrow defaults
    let tmrTemp = 0;
    let tmrCode = 0;
    let tmrDesc = 'Wait...';
    let tmrMax: number | undefined;
    let tmrMin: number | undefined;

    if (weather && weather.daily.time.length > 1) {
        tmrTemp = (weather.daily.temperature_2m_max[1] + weather.daily.temperature_2m_min[1]) / 2;
        tmrCode = weather.daily.weather_code[1];
        tmrDesc = getWeatherDesc(tmrCode);
        tmrMax = weather.daily.temperature_2m_max[1];
        tmrMin = weather.daily.temperature_2m_min[1];
    }

    return (
        <div className={styles.screen}>
            {/* Top Area: Digital Clock (75%) */}
            <section className={styles.topSection}>
                <DigitalClock time={time} />
            </section>

            {/* Bottom Area: Widgets (25%) */}
            <section className={styles.bottomSection}>
                <motion.div
                    className={styles.widgetRow}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {/* Column 1: Today Weather */}
                    <div className={styles.widgetCol}>
                        <WeatherWidget
                            title="오늘 날씨"
                            temperature={todayTemp}
                            weatherCode={todayCode}
                            description={todayDesc}
                            maxTemp={todayMax}
                            minTemp={todayMin}
                            humidity={todayHumidity}
                        />
                    </div>

                    <div className={styles.divider} />

                    {/* Column 2: Tomorrow Weather */}
                    <div className={styles.widgetCol}>
                        <WeatherWidget
                            title="내일 날씨"
                            temperature={tmrTemp}
                            weatherCode={tmrCode}
                            description={tmrDesc}
                            maxTemp={tmrMax}
                            minTemp={tmrMin}
                        />
                    </div>

                    <div className={styles.divider} />

                    {/* Column 3: Finance (Wide) */}
                    <div className={styles.widgetColWide}>
                        <header className={styles.colTitle}>금융</header>
                        <FinanceWidget />
                    </div>
                </motion.div>
            </section>
        </div>
    );
};
