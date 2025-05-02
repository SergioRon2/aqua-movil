/**
 * Capitalizes the first letter of a given string.
 * @param str - The string to capitalize.
 * @returns The string with the first letter capitalized.
 */
export function capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
