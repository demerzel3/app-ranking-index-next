export const secondsInMillis = (n: number) => n * 1000;
export const minutesInMillis = (n: number) => n * secondsInMillis(60);
export const hoursInMillis = (n: number) => n * minutesInMillis(60);

export const minutesInSeconds = (n: number) => n * 60;
export const hoursInSeconds = (n: number) => n * minutesInSeconds(60);
export const daysInSeconds = (n: number) => n * hoursInSeconds(24);
