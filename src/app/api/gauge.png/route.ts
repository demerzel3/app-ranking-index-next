import { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import qs from 'qs';

import { cacheKeyToGaugeProps } from '@/lib/gauge';

import { getApiHost } from '../../../lib/getApiHost';

const SCREENSHOTONE_ACCESS_KEY = process.env.SCREENSHOTONE_ACCESS_KEY;

export async function GET(req: NextApiRequest) {
  const cacheKey = req.query['cacheKey'];
  if (typeof cacheKey !== 'string') {
    return NextResponse.json({ error: 'Invalid cache key, please provide a string' }, { status: 400 });
  }

  const gaugeProps = cacheKeyToGaugeProps(cacheKey);
  if (!gaugeProps) {
    return NextResponse.json({ error: 'Invalid cache key, please provide a valid cache key' }, { status: 400 });
  }

  const gaugeUrl = `https://${getApiHost(req)}/gauge/${encodeURIComponent(cacheKey)}`;
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
        // TODO: add immutable directive once testing is done
        'Cache-Control': 'max-age=31536000, s-maxage=31536000, public', // Cache for 1 year
      },
      status: 200,
    });
  } else {
    return NextResponse.json(await screenshot.json(), { status: 500 });
  }
}
