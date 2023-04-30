import { NextResponse } from 'next/server';
import qs from 'qs';

import { getLatest24HAverage, getLatestEntry } from '@/lib/database';
import { sortByRanking } from '@/lib/sortByRanking';

import { getApiHost } from '../../../lib/getApiHost';

const SCREENSHOTONE_ACCESS_KEY = process.env.SCREENSHOTONE_ACCESS_KEY;

export async function GET(req: Request) {
  const [index, latestEntry] = await Promise.all([getLatest24HAverage(), getLatestEntry()]);

  if (!latestEntry) {
    return NextResponse.json({ error: 'Failed to retrieve the latest entry from the database' }, { status: 500 });
  }

  const cacheKey =
    'i' +
    String(Math.round(index * 100)) +
    'd' +
    sortByRanking(latestEntry.details)
      .slice(0, 5)
      .map(({ name, ranking }) => `${ranking}${name}`)
      .join('');

  const gaugeUrl = `https://${getApiHost(req)}/gauge`;
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
    cache_key: cacheKey,
  };
  const screenshotUrl = `https://api.screenshotone.com/take?${qs.stringify(screenshotParams)}`;
  const screenshot = await fetch(screenshotUrl);

  if (screenshot.ok) {
    return new NextResponse(await screenshot.blob(), {
      headers: {
        'Content-Type': 'image/png',
      },
      status: 200,
    });
  } else {
    return NextResponse.json(await screenshot.json(), { status: 500 });
  }
}
