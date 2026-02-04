import axios from 'axios';

const api = axios.create({
    timeout: 10000,
});

export const fetchData = async <T>(url: string): Promise<T | null> => {
    try {
        const response = await api.get<T>(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
};
