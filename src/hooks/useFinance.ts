import { useState, useEffect } from 'react';


export interface FinanceItem {
    name: string;
    symbol: string;
    price: number;
    change: number;
    currency: string;
}


export const useFinance = () => {
    const [data, setData] = useState<FinanceItem[]>([]);

    useEffect(() => {
        const getFinanceData = async () => {
            try {
                // Fetch from the local JSON file
                const response = await fetch('finance.json?' + new Date().getTime()); // Relative path for GH Pages
                if (!response.ok) throw new Error('Network response was not ok');
                const jsonData = await response.json();

                // Validate/Process
                // Python stores 'change' as percent directly
                const processed = jsonData.map((item: any) => ({
                    ...item,
                    name: item.name,
                    price: item.price,
                    change: item.change, // already in %
                    currency: item.currency
                }));

                setData(processed);
            } catch (error) {
                console.warn("Failed to load finance.json, falling back to mock unavailable or keeping old data", error);
                // Optional: Fallback logic or just nothing
            }
        };

        getFinanceData();
        const interval = setInterval(getFinanceData, 10 * 1000); // Check every 10 sec (file might update)

        return () => clearInterval(interval);
    }, []);

    return data;
};
