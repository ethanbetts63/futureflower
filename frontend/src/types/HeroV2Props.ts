export interface HeroV2Props {
  title: React.ReactNode;
  subtext: string;
  image: {
    src: string;
    srcSet: string;
    mobileSrcSet?: string;
    alt: string;
  };
}
