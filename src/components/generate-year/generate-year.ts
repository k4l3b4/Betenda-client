const generateYearOptions = (start: number, end: number): { value: string; label: string }[] => {
    const years = [];
    for (let year = start; year <= end; year++) {
        years.push({ value: String(year), label: String(year) });
    }
    return years;
};

export default generateYearOptions