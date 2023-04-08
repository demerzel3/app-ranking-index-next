export const secondsInMillis = (n: number) => n * 1000;
export const minutesInMillis = (n: number) => n * secondsInMillis(60);
export const hoursInMillis = (n: number) => n * minutesInMillis(60);
