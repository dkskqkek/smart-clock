import { useState, useEffect } from 'react';


export interface FinanceItem {
    name: string;
    symbol: string;
    price: number;
    change: number;
    currency: string;
    status?: string;
}

export interface FinanceMeta {
    updated_at: string;
    status: string;
    source: string;
}

export interface UseFinanceReturn {
    items: FinanceItem[];
    meta: FinanceMeta | null;
    isStale: boolean;
}

export const useFinance = (): UseFinanceReturn => {
    const [data, setData] = useState<UseFinanceReturn>({ items: [], meta: null, isStale: false });

    useEffect(() => {
        const getFinanceData = async () => {
            try {
                // Fetch from the local JSON file
                const response = await fetch('finance.json?' + new Date().getTime()); // Relative path for GH Pages
                if (!response.ok) throw new Error('Network response was not ok');
                const jsonData = await response.json();

                // Check structure: is it new { meta, data } or old array?
                let items: FinanceItem[] = [];
                let meta: FinanceMeta | null = null;

                if (Array.isArray(jsonData)) {
                    // Old format fallback
                    items = jsonData;
                } else if (jsonData.data && Array.isArray(jsonData.data)) {
                    // New format
                    items = jsonData.data;
                    meta = jsonData.meta;
                }

                // Process items (ensure types)
                const processed = items.map((item: any) => ({
                    ...item,
                    name: item.name,
                    price: item.price,
                    change: item.change,
                    currency: item.currency
                }));

                // Check staleness if meta exists
                let isStale = false;
                if (meta && meta.updated_at) {
                    const lastUpdate = new Date(meta.updated_at);
                    const now = new Date();
                    const diffMs = now.getTime() - lastUpdate.getTime();
                    // Consider stale if older than 1 hour (3600 * 1000 ms)
                    if (diffMs > 60 * 60 * 1000) {
                        isStale = true;
                    }
                }

                setData({ items: processed, meta, isStale });
            } catch (error) {
                console.warn("Failed to load finance.json", error);
                // Keep existing data or could set error state
            }
        };

        getFinanceData();
        const interval = setInterval(getFinanceData, 30 * 1000); // Check every 30 sec

        return () => clearInterval(interval);
    }, []);

    return data;
};
