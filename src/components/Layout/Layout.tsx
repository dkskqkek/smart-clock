import React, { type ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
    clock: ReactNode;
    weather: ReactNode;
    finance: ReactNode;
    tips: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ clock, weather, finance, tips }) => {
    return (
        <div className={styles.background}>
            <div className={styles.container}>
                <div className={styles.clockArea}>{clock}</div>
                <div className={styles.weatherArea}>{weather}</div>
                <div className={styles.financeArea}>{finance}</div>
                <div className={styles.tipsArea}>{tips}</div>
            </div>
        </div>
    );
};
