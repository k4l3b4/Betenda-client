const GetFromStorage = <T>(key: string): T | null | boolean => {
    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null && storedValue !== 'undefined') {
            try {
                return JSON.parse(storedValue) as T;
            } catch (error) {
                return null
            }
        }
    }
    return null;
};

export default GetFromStorage