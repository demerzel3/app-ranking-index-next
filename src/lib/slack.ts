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

  // Upload screenshot using new Slack file upload API
  const filename = `app-ranking-index-${new Date().toISOString().slice(0, 10)}.png`;
  const fileTitle = formatDate(new Date());

  try {
    // Step 1: Get upload URL
    const getUploadUrlResponse = await fetch('https://slack.com/api/files.getUploadURLExternal', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        filename,
        length: screenshotBlob.size.toString(),
      }),
    });
    if (!getUploadUrlResponse.ok) {
      throw new Error(`Error getting upload URL: ${getUploadUrlResponse.statusText}`);
    }

    const uploadUrlResult = await getUploadUrlResponse.json();
    if (!uploadUrlResult.ok) {
      throw new Error(`Error getting upload URL: ${uploadUrlResult.error}`);
    }
    const { upload_url, file_id } = uploadUrlResult;

    // Step 2: Upload file to the URL
    const uploadResponse = await fetch(upload_url, {
      method: 'POST',
      body: screenshotBlob,
    });
    if (!uploadResponse.ok) {
      throw new Error(`Error uploading file to URL: ${uploadResponse.statusText}`);
    }

    // Step 3: Complete the upload
    const completeUploadResponse = await fetch('https://slack.com/api/files.completeUploadExternal', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        files: JSON.stringify([
          {
            id: file_id,
            title: fileTitle,
          },
        ]),
        channels: SLACK_CHANNEL ?? '',
      }),
    });
    if (!completeUploadResponse.ok) {
      throw new Error(`Error completing upload: ${completeUploadResponse.statusText}`);
    }

    const completeResult = await completeUploadResponse.json();
    if (!completeResult.ok) {
      throw new Error(`Error completing upload: ${completeResult.error}`);
    }

    console.log('File uploaded:', file_id);
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
