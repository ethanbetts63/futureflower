import CorporateFlowerSubscriptions from './CorporateFlowerSubscriptions';
import { getRouteMetadata } from '@/lib/routeMetadata';

export const metadata = getRouteMetadata('/corporate-flower-subscriptions');

export default function Page() {
  return <CorporateFlowerSubscriptions />;
}
