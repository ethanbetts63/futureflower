import SendFlowersToAustraliaFromOverseas from './SendFlowersToAustraliaFromOverseas';
import { getRouteMetadata } from '@/lib/routeMetadata';

export const metadata = getRouteMetadata('/send-flowers-to-australia-from-overseas');

export default function Page() {
  return <SendFlowersToAustraliaFromOverseas />;
}
