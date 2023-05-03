import '../noBackground.css';

import GaugeWidget from '@/components/GaugeWidget';
import { cacheKeyToGaugeProps } from '@/lib/gauge';

export default async function CustomGaugePage({ params }: { params: { cacheKey: string } }) {
  const props = cacheKeyToGaugeProps(decodeURIComponent(params.cacheKey));

  if (!props) {
    return null;
  }

  return <GaugeWidget {...props} />;
}
