export const parseProgress = (value: number | string | null | undefined): number => {
    if (!value) return 0;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? 0 : Math.min(num / 100, 1); // entre 0 y 1
};