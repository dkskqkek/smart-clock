import React from 'react';
import { motion } from 'framer-motion';
import { useFinance, type FinanceItem } from '../../hooks/useFinance';
import styles from './FinanceWidget.module.css';

const TickerPill = ({ item }: { item: FinanceItem }) => {
    const isUp = item.change >= 0;

    return (
        <motion.div
            className={styles.pill}
            whileHover={{ y: -2, boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
        >
            <div className={styles.header}>
                <span className={styles.name}>{item.name.replace('Bitcoin', 'BTC')}</span>
                <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
                    {isUp ? '▲' : '▼'}{Math.abs(item.change).toFixed(2)}%
                </span>
            </div>
            <div className={styles.price}>
                {item.price.toLocaleString()}
            </div>
        </motion.div>
    );
};

export const FinanceWidget: React.FC = () => {
    const financeData = useFinance();
    const targets = ['KOSPI', 'Gold', 'Bitcoin', 'NASDAQ'];

    return (
        <div className={styles.grid}>
            {targets.map(sym => {
                const item = financeData.find(f => f.name === sym || f.symbol === sym);
                if (!item) return null;
                return <TickerPill key={sym} item={item} />;
            })}
        </div>
    );
};
