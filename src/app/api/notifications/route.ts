import { NextResponse } from 'next/server';

import { getLatestEntry } from '@/lib/database';
import { postToSlack } from '@/lib/slack';

export async function POST() {
  const entry = await getLatestEntry();
  if (!entry) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve the latest entry from the database',
      },
      { status: 500 }
    );
  }

  await postToSlack(entry.value, entry.details);

  return new NextResponse('', { status: 200 });
}
