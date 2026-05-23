
import type { SeoProps } from '../types/SeoProps';
import { buildStructuredData } from '@/lib/seo';

const Seo = ({
  title,
  description,
  canonicalPath,
  ogType,
  ogImage,
  noindex,
  structuredData,
}: SeoProps) => {
  const schemas = buildStructuredData({
    title,
    description,
    canonicalPath,
    ogType,
    ogImage,
    noindex,
    structuredData,
  });

  if (!schemas.length) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
};

export default Seo;
