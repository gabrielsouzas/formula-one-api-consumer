export function parseTimeStringToMillis(timeString) {
    const parts = timeString.split(':');

    if (parts.length !== 2) {
        throw new Error('Formato de tempo inválido');
    }

    const minutes = parseInt(parts[0]);
    const secondsAndMillis = parts[1].split('.');
    const seconds = parseInt(secondsAndMillis[0]);
    const milliseconds = parseInt(secondsAndMillis[1]);

    const totalTimeInMillis = (minutes * 60 + seconds) * 1000 + milliseconds;

    return totalTimeInMillis;
}

export function formatTimeForDisplay(timeInMillis) {
    const totalSeconds = timeInMillis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = timeInMillis % 1000;

    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}