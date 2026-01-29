import type { UserProfile } from './users';
import type { UpfrontPlan, SubscriptionPlan } from './plans';
import type { DeliveryEvent } from './events';
import type { FaqItem } from './data';
import type { ButtonProps } from '../components/ui/button';

export interface UserDetailsSummaryProps {
  user: UserProfile | null;
}

export interface ArticleCarouselProps {
  exclude?: string;
  showAll?: boolean;
}

export interface ArticleLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  faqPage?: string;
  children: React.ReactNode;
}

export interface ColorSwatchProps {
  hex: string;
  isSelected: boolean;
  onClick: () => void;
}

export interface DeliveryDatesCardProps {
    plan: UpfrontPlan | SubscriptionPlan;
    editUrl: string;
}

export interface EditButtonProps extends Omit<ButtonProps, 'asChild' | 'children'> {
  to: string;
}

export interface FaqV2Props {
  title: string;
  faqs: FaqItem[];
}

export interface HeroProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  imageSrc: string;
  srcSet?: string;
  imageAlt: string;
  ctaElement?: React.ReactNode;
}

export interface HeroV2Props {
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

export interface MessagesCardProps {
    plan: UpfrontPlan | SubscriptionPlan;
    editUrl: string;
}

export interface NextDeliveryInfo {
    plan: UpfrontPlan | SubscriptionPlan;
    event: DeliveryEvent;
    deliveryIndex: number;
}

export interface NextDeliveryCardProps {
    deliveryInfo: NextDeliveryInfo | null;
}

export interface OtherSite {
    name: string;
    logoSrc: string;
    description: string;
    url: string;
}

export interface OtherSitesProps {
    sites: OtherSite[];
}
