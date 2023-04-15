import { hoursInSeconds } from './time';

type DataPoint = { time: number; value: number };

export const calculate24hRollingAverage = (data: DataPoint[]): DataPoint[] => {
  // Define the duration of 24 hours in seconds
  const window = hoursInSeconds(24);

  // Create a new array to store the rolling averages
  const rollingAverages: DataPoint[] = [];

  // Initialize variables to keep track of the window's sum and element count
  let windowSum = 0;
  let windowCount = 0;

  // Initialize a pointer to the start of the window
  let windowStart = 0;

  // Iterate through the data points
  for (const item of data) {
    // Get the current data point's time
    const currentTime = item.time;

    // Calculate the start time for the 24-hour window
    const startTime = currentTime - window;

    // Update the window's sum and count by including the current data point
    windowSum += item.value;
    windowCount++;

    // Move the windowStart pointer forward if the start data point is outside the 24-hour window
    while (data[windowStart].time <= startTime) {
      windowSum -= data[windowStart].value;
      windowCount--;
      windowStart++;
    }

    // Calculate the average value for the data points in the window
    const average = windowCount > 0 ? windowSum / windowCount : 0;

    // Add the rolling average to the new array
    rollingAverages.push({ time: currentTime, value: average });
  }

  return rollingAverages;
};
