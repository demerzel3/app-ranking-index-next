import 'server-only';

import { getPool } from './getPool';
import { Details } from './types';

export type HistoryEntry = {
  time: number;
  value: number;
  details: Details[];
};

export const readHistory = async ({
  fromTime,
  toTime,
  includeDetails = false,
}: {
  fromTime: number;
  toTime?: number;
  includeDetails?: boolean;
}): Promise<HistoryEntry[]> => {
  const client = await getPool().connect();
  const fields = includeDetails ? 'time, value, details' : 'time, value';
  try {
    const result =
      typeof toTime === 'number'
        ? await client.query(`SELECT ${fields} FROM history WHERE time >= $1 AND time <= $2 ORDER BY time`, [
            fromTime,
            toTime,
          ])
        : await client.query(`SELECT ${fields} FROM history WHERE time >= $1 ORDER BY time`, [fromTime]);

    return result.rows.map(parseHistoryEntry);
  } catch (err: any) {
    console.log(err.stack);
  } finally {
    client.release();
  }

  return [];
};

export const storeInHistory = async (index: number, details: Details[]) => {
  const client = await getPool().connect();
  try {
    await client.query('INSERT INTO history (time, value, details) VALUES (round(extract(epoch from now())), $1, $2)', [
      index,
      JSON.stringify(details),
    ]);
  } catch (err: any) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

export const getLatestEntry = async (): Promise<HistoryEntry | undefined> => {
  const client = await getPool().connect();
  try {
    const result = await client.query('SELECT * FROM history ORDER BY time DESC limit 1');

    if (result.rowCount === 0) {
      return undefined;
    }

    return parseHistoryEntry(result.rows[0]);
  } catch (err: any) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

export const getLatest24HAverage = async (): Promise<number> => {
  const client = await getPool().connect();
  try {
    const result = await client.query(
      'SELECT AVG(value) as avg FROM history WHERE time >= ((SELECT time FROM history ORDER BY time DESC LIMIT 1) - 86400)'
    );

    return parseFloat(result.rows[0].avg);
  } catch (err: any) {
    console.log(err.stack);
    return 0;
  } finally {
    client.release();
  }
};

function parseHistoryEntry(row: any): HistoryEntry {
  const { time, value, details } = row;

  return {
    time: parseFloat(time),
    value: parseFloat(value),
    details: details ?? [],
  };
}
