export interface ProductCarouselStep {
  level: number;
  title: string;
  description: string;
  image: {
    src: string;
    srcSet: string;
    sizes: string;
    alt: string;
  };
}
