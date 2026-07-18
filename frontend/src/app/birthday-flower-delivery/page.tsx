import BirthdayFlowerDelivery from "@/app/birthday-flower-delivery/BirthdayFlowerDelivery";
import { getRouteMetadata } from "@/lib/routeMetadata";

export const metadata = getRouteMetadata("/birthday-flower-delivery");

export default function Page() {
  return <BirthdayFlowerDelivery />;
}
