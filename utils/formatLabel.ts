export const formatLabel = (label: string) => {
    const maxLength = 10;
    const words = label.split(' ');
    let result = '';
    let line = '';

    for (let word of words) {
        if ((line + word).length > maxLength) {
            result += line + '\n';
            line = word + ' ';
        } else {
            line += word + ' ';
        }
    }

    result += line.trim();
    return result;
};