import { redirect } from 'next/navigation';

export const revalidate = 3600; // 1 hour

export default async function CurrentGaugePngPage() {
  redirect('/api/gauge.png');
}
