import crypto from 'crypto';
import qs from 'qs';

import { gaugePropsToCacheKey, getLatestGaugeProps } from './gauge';

const { SLACK_BOT_TOKEN, SLACK_CHANNEL, SCREENSHOTONE_ACCESS_KEY } = process.env;

export const postGaugeToSlack = async (host: string) => {
  const gaugeProps = await getLatestGaugeProps();
  if (!gaugeProps) {
    console.error('Failed to retrieve the latest gauge props');
    return;
  }

  // Take screenshot
  const cacheKey = gaugePropsToCacheKey(gaugeProps);
  const gaugeUrl = `https://${host}/gauge/${encodeURIComponent(cacheKey)}`;
  const screenshotParams = {
    access_key: SCREENSHOTONE_ACCESS_KEY,
    url: gaugeUrl,
    viewport_width: 450,
    viewport_height: 290,
    device_scale_factor: 3,
    format: 'png',
    omit_background: true,
    cache: true,
    cache_ttl: 2592000,
    cache_key: getHashedCacheKey(cacheKey),
  };
  const screenshotUrl = `https://api.screenshotone.com/take?${qs.stringify(screenshotParams)}`;
  const screenshotResponse = await fetch(screenshotUrl);

  if (!screenshotResponse.ok) {
    console.error(
      `Failed to retrieve the screenshot for ${cacheKey}: ${JSON.stringify(await screenshotResponse.json())}`
    );
    return;
  }

  const screenshotBlob = await screenshotResponse.blob();

  // Upload screenshot
  const formData = new FormData();
  const filename = `app-ranking-index-${new Date().toISOString().slice(0, 10)}.png`;

  formData.append('token', SLACK_BOT_TOKEN ?? '');
  formData.append('channels', SLACK_CHANNEL ?? '');
  formData.append('file', screenshotBlob, filename);
  formData.append('title', formatDate(new Date()));

  try {
    const response = await fetch('https://slack.com/api/files.upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error uploading file: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.ok) {
      throw new Error(`Error uploading file: ${result.error}`);
    }

    console.log('File uploaded:', result.file.id);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

const getHashedCacheKey = (cacheKey: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(cacheKey);

  return hash.digest('hex');
};

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
};
