import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, CloudLightning } from 'lucide-react';
import styles from './WeatherWidget.module.css';

interface WeatherWidgetProps {
    title: string;
    temperature: number;
    weatherCode: number;
    description: string;
    maxTemp?: number;
    minTemp?: number;
    humidity?: number;
}

const getWeatherIcon = (code: number) => {
    const props = { size: "5vmin", color: "#ffffff", strokeWidth: 2 };

    // Animation variant for floating effect
    const floatAnim = {
        y: [0, -5, 0],
        transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut" as const
        }
    };

    let Icon = Sun;
    if (code >= 1 && code <= 3) Icon = Cloud;
    else if (code >= 45 && code <= 48) Icon = CloudFog;
    else if (code >= 51 && code <= 67) Icon = CloudRain;
    else if (code >= 71 && code <= 77) Icon = CloudSnow;
    else if (code >= 80 && code <= 82) Icon = CloudRain;
    else if (code >= 95) Icon = CloudLightning;

    return (
        <motion.div animate={floatAnim}>
            <Icon {...props} />
        </motion.div>
    );
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
    title, temperature, weatherCode, description, maxTemp, minTemp, humidity
}) => {
    return (
        <motion.div
            className={styles.container}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            transition={{ type: 'spring', stiffness: 400 }}
        >
            <div className={styles.title}>{title}</div>
            <div className={styles.content}>
                <div className={styles.iconArea}>
                    {getWeatherIcon(weatherCode)}
                </div>
                <div className={styles.infoArea}>
                    <div className={styles.temp}>{Math.round(temperature)}°</div>
                    <div className={styles.desc}>{description}</div>
                </div>
            </div>

            <div className={styles.details}>
                {maxTemp !== undefined && minTemp !== undefined && (
                    <div className={styles.detailItem}>
                        <span className={styles.high}>H:{Math.round(maxTemp)}°</span>
                        <span className={styles.low}>L:{Math.round(minTemp)}°</span>
                    </div>
                )}
                {humidity !== undefined && (
                    <div className={styles.detailItem}>
                        <span>💧 {humidity}%</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
