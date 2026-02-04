import React from 'react';
import { useTime } from '../../hooks/useTime';
import styles from './Clock.module.css';

export const Clock: React.FC = () => {
    const time = useTime();

    const formattedTime = time.toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const formattedDate = time.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    return (
        <div className={styles.container}>
            <div className={styles.time}>{formattedTime}</div>
            <div className={styles.date}>{formattedDate}</div>
        </div>
    );
};
