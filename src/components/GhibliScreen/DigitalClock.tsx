import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DigitalClock.module.css';

interface DigitalClockProps {
    time: Date;
}

const Digit = ({ value }: { value: string }) => (
    <div className={styles.digitContainer}>
        <AnimatePresence mode="popLayout">
            <motion.span
                key={value}
                initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                className={styles.digit}
            >
                {value}
            </motion.span>
        </AnimatePresence>
    </div>
);

export const DigitalClock: React.FC<DigitalClockProps> = ({ time }) => {
    const hours = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit' }).split('');
    const minutes = time.toLocaleTimeString('en-US', { minute: '2-digit' }).split('');

    return (
        <motion.div
            className={styles.clockWrapper}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
        >
            <div className={styles.timeDisplay}>
                <div className={styles.digitGroup}>
                    <Digit value={hours[0]} />
                    <Digit value={hours[1]} />
                </div>
                <motion.span
                    className={styles.separator}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    :
                </motion.span>
                <div className={styles.digitGroup}>
                    <Digit value={minutes[0]} />
                    <Digit value={minutes[1]} />
                </div>
            </div>

            <div className={styles.secondsBar}>
                <motion.div
                    className={styles.secondsProgress}
                    initial={{ width: "0%" }}
                    animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
                    transition={{ duration: 0.5, type: 'spring' }}
                />
            </div>
        </motion.div>
    );
};
