import React, { useState } from 'react';
import styles from './LocationModal.module.css';

interface LocationModalProps {
    onClose: () => void;
    onSelectLocation: (lat: number, lon: number, name: string) => void;
    onSearch: (query: string) => Promise<boolean>;
}

const PRESETS = [
    { name: '서울', lat: 37.5665, lon: 126.9780 },
    { name: '판교', lat: 37.3948, lon: 127.1111 },
    { name: '강남', lat: 37.4979, lon: 127.0276 },
    { name: '부산', lat: 35.1796, lon: 129.0756 },
    { name: '대구', lat: 35.8714, lon: 128.6014 },
    { name: '인천', lat: 37.4563, lon: 126.7052 },
    { name: '광주', lat: 35.1595, lon: 126.8526 },
    { name: '대전', lat: 36.3504, lon: 127.3845 },
    { name: '제주', lat: 33.4996, lon: 126.5312 },
];

export const LocationModal: React.FC<LocationModalProps> = ({ onClose, onSelectLocation, onSearch }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        const success = await onSearch(query);
        setLoading(false);

        if (success) {
            onClose();
        } else {
            alert('위치를 찾을 수 없습니다. 정확한 지명(구/동)을 입력해주세요.');
        }
    };

    return (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={styles.modal}>
                <div className={styles.title}>위치 설정</div>

                <div className={styles.sectionTitle}>주요 지역 바로가기</div>
                <div className={styles.presetGrid}>
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.name}
                            className={styles.presetBtn}
                            onClick={() => {
                                onSelectLocation(preset.lat, preset.lon, preset.name);
                                onClose();
                            }}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>

                <div className={styles.sectionTitle}>직접 검색</div>
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="예: 분당구, 해운대, 역삼동"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className={styles.searchBtn} disabled={loading}>
                        {loading ? '...' : '검색'}
                    </button>
                </form>

                <button className={styles.closeBtn} onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};
