import { Details } from '@/lib/types';

export function sortByRanking(details: Details[]) {
  return [...(details ?? [])].sort((det1, det2) => {
    if (det2.ranking === null && det1.ranking !== null) {
      return -1;
    }
    if (det1.ranking === null && det2.ranking !== null) {
      return 1;
    }
    if (det1.ranking === null && det2.ranking === null) {
      return det2.weight - det1.weight;
    }

    return det1.ranking! - det2.ranking!;
  });
}
