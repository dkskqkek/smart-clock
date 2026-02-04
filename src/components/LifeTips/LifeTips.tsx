import React, { useState, useEffect } from 'react';
import { TIPS } from './tipsData';
import styles from './LifeTips.module.css';
import { Lightbulb } from 'lucide-react';

export const LifeTips: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Simple random tip on mount
        setIndex(Math.floor(Math.random() * TIPS.length));
    }, []);

    return (
        <div className={styles.container}>
            <Lightbulb size={20} className={styles.icon} />
            <p className={styles.text}>{TIPS[index]}</p>
        </div>
    );
};
