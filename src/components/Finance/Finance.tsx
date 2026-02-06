import React from 'react';
import { useFinance } from '../../hooks/useFinance';
import styles from './Finance.module.css';
import clsx from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const Finance: React.FC = () => {
    const { items: data } = useFinance();

    return (
        <div className={styles.grid}>
            {data.map((item) => (
                <div key={item.symbol} className={styles.card}>
                    <span className={styles.name}>{item.name}</span>
                    <span className={styles.price}>
                        {item.currency === 'USD' ? '$' : ''}
                        {item.price.toLocaleString()}
                        {item.currency === 'KRW' ? '' : ''}
                    </span>
                    <span className={clsx(styles.change, item.change >= 0 ? styles.up : styles.down)}>
                        {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(item.change).toFixed(2)}%
                    </span>
                </div>
            ))}
        </div>
    );
};
