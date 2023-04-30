import auth from 'basic-auth';
import { NextResponse } from 'next/server';
import qs from 'qs';

import { getLatest24HAverage, getLatestEntry } from '@/lib/database';
import { postToSlack } from '@/lib/slack';

const SCREENSHOTONE_API_KEY = process.env.SCREENSHOTONE_API_KEY;

export async function GET(req: Request) {
  const [index, latestEntry] = await Promise.all([getLatest24HAverage(), getLatestEntry()]);

  if (!latestEntry) {
    return NextResponse.json({ error: 'Failed to retrieve the latest entry from the database' }, { status: 500 });
  }

  const gaugeUrl = `${getProtocol()}${req.headers.get('host')}/gauge`;
  const screenshotParams = {
    access_key: SCREENSHOTONE_API_KEY,
    url: gaugeUrl,
    viewport_width: 450,
    viewport_height: 290,
    device_scale_factor: 3,
    format: 'png',
    omit_background: true,
    cache: true,
    cache_ttl: 2592000,
    cache_key: 'some-cache-key', // TODO: fix this
  };
  const screenshotUrl = `https://api.screenshotone.com/take?${qs.stringify(screenshotParams)}`;
  const screenshot = await fetch(screenshotUrl);

  return new NextResponse(await screenshot.blob(), {
    headers: {
      'Content-Type': 'image/png',
    },
    status: 200,
  });
}

export function getProtocol() {
  const isProd = process.env.VERCEL_ENV === 'production';

  return isProd ? 'https://' : 'http://';
}
