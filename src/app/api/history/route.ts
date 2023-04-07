import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

import { fetchUSFinanceAppIds } from '@/lib/appStore';
import { fetchExchangesWeighted } from '@/lib/coingecko';
import { readHistory, storeInHistory } from '@/lib/database';
import { EXCHANGE_META, ExchangeMeta } from '@/lib/meta';
import { Details, ExchangeName } from '@/lib/types';

export async function GET() {
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 3600;
  const records = await readHistory({
    fromTime: thirtyDaysAgo,
  });

  return NextResponse.json(
    records.map((entry) => ({
      ...entry,
      // Round the time to the hour
      time: Math.floor(entry.time / 3600) * 3600,
    }))
  );
}

export async function POST() {
  const [appIdsByRank, exchangeWeight] = await Promise.all([fetchUSFinanceAppIds(), fetchExchangesWeighted()]);
  const appIdsByRankMap = appIdsByRank.reduce((map, id, index) => {
    map[id] = index + 1;

    return map;
  }, {} as Record<string, number>);
  const details: Details[] = (Object.entries(EXCHANGE_META) as [ExchangeName, ExchangeMeta][]).map(([name, meta]) => {
    const ranking = appIdsByRankMap[meta.appId] ?? null;
    const weight = exchangeWeight[name];
    const impact = ranking === null ? 0 : expo((201 - ranking) / 200) * weight;

    return {
      name: name as ExchangeName,
      ranking,
      weight,
      impact,
    };
  });
  const index = details.reduce((currentIndex, { impact }) => currentIndex + impact, 0);

  await storeInHistory(index, details);

  return NextResponse.json({ index, details });
}

function expo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
