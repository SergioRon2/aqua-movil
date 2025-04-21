export const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9.-]+/g, '')) || 0;
};
