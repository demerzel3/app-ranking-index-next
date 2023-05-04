import auth from 'basic-auth';
import { NextResponse } from 'next/server';

import { getApiHost } from '@/lib/getApiHost';
import { postGaugeToSlack } from '@/lib/slack';

export async function POST(req: Request) {
  const credentials = auth.parse(req.headers.get('authorization') ?? '');
  if (
    !credentials ||
    credentials.name !== process.env.CRON_USERNAME ||
    credentials.pass !== process.env.CRON_PASSWORD
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const host = getApiHost(req);
  if (!host) {
    return NextResponse.json({ error: 'Failed to retrieve the host' }, { status: 500 });
  }
  await postGaugeToSlack(host);

  return new NextResponse('', { status: 200 });
}
