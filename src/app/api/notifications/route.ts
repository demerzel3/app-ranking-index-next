import auth from 'basic-auth';
import { NextResponse } from 'next/server';

import { getLatestEntry } from '@/lib/database';
import { getApiHost } from '@/lib/getApiHost';
import { postGaugeToSlack, postToSlack } from '@/lib/slack';

export async function POST(req: Request) {
  const credentials = auth.parse(req.headers.get('authorization') ?? '');
  if (
    !credentials ||
    credentials.name !== process.env.CRON_USERNAME ||
    credentials.pass !== process.env.CRON_PASSWORD
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // const entry = await getLatestEntry();
  // if (!entry) {
  //   return NextResponse.json({ error: 'Failed to retrieve the latest entry from the database' }, { status: 500 });
  // }

  // await postToSlack(entry.value, entry.details);
  const host = getApiHost(req);
  if (!host) {
    return NextResponse.json({ error: 'Failed to retrieve the host' }, { status: 500 });
  }
  await postGaugeToSlack(host);

  return new NextResponse('', { status: 200 });
}
