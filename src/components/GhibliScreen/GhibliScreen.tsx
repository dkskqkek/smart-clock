import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DigitalClock } from './DigitalClock';
import { WeatherWidget } from './WeatherWidget';
import { FinanceWidget } from './FinanceWidget';
import { useWeather } from '../../hooks/useWeather';
import styles from './GhibliScreen.module.css';

export const GhibliScreen: React.FC = () => {
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
        tmrDesc = '예보';
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
