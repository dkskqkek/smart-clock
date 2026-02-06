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
    // Destructure new return type
    const { items: financeData, isStale, meta } = useFinance();
    const targets = ['KOSPI', 'Gold', 'Bitcoin', 'NASDAQ'];

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                className={styles.grid}
                style={{
                    opacity: isStale ? 0.5 : 1,
                    transition: 'opacity 0.3s'
                }}
            >
                {targets.map(sym => {
                    const item = financeData.find(f => f.name === sym || f.symbol === sym);
                    if (!item) return null;
                    return <TickerPill key={sym} item={item} />;
                })}
            </div>

            {/* Stale Indicator */}
            {isStale && (
                <div style={{
                    position: 'absolute',
                    bottom: '1vmin',
                    right: '1vmin',
                    color: '#FF8A80',
                    fontSize: '2vmin',
                    fontWeight: 600,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5vmin',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '0.5vmin 1vmin',
                    borderRadius: '0.8vmin'
                }}>
                    <span>⚠️ Data Stale</span>
                    {meta?.updated_at && (
                        <span style={{ fontSize: '1.5vmin', opacity: 0.8 }}>
                            ({new Date(meta.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
