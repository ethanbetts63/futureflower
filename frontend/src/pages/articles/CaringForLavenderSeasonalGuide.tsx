import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/lavender.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';
import { Link } from 'react-router-dom';

const CaringForLavenderSeasonalGuide = () => {
  const articleDetails = {
    title: "When & How to Care for Lavender (Seasonal Guide)",
    description: "Lavender care revolves around proper timing. Most problems come from pruning into the plant’s woody base or encouraging lush growth with too much water or fertilizer.",
    url: "https://www.foreverflower.app/articles/caring-for-lavender-seasonal-guide",
    ogImage: "/static/og-images/og-caring-for-lavender-seasonal-guide.webp",
    authorName: "The ForeverFlower Team",
    publisherName: "ForeverFlower",
    publisherLogoUrl: "https://www.foreverflower.app/static/logo_128_black.png",
    datePublished: "2025-12-22T00:00:00Z",
    dateModified: "2025-12-22T00:00:00Z",
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleDetails.url,
    },
    headline: articleDetails.title,
    description: articleDetails.description,
    image: `https://www.foreverflower.app${articleDetails.ogImage}`,
    author: {
      '@type': 'Person',
      name: articleDetails.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: articleDetails.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: articleDetails.publisherLogoUrl,
      },
    },
    datePublished: articleDetails.datePublished,
    dateModified: articleDetails.dateModified,
  };

  return (
    <>
      <Seo
        title={articleDetails.title}
        description={articleDetails.description}
        canonicalPath="/articles/caring-for-lavender-seasonal-guide"
        ogType="article"
        ogImage={articleDetails.ogImage}
        structuredData={structuredData}
      />
      <ArticleLayout
        title="When & How to Care for Lavender (A Seasonal Guide)"
        subtitle={<>Lavender care revolves around proper timing rather than heavy-handed shaping. Most problems come from pruning into the plant’s woody base or encouraging lush, tender growth with too much water or fertilizer. <strong>Knowing your lavender type and scheduling light, timely maintenance preserves blooms</strong> and the plant’s aromatic, compact shape.</>}
        imageSrc={articleImage}
        imageAlt="A field of blooming lavender under the sun"
        faqPage="caring-for-lavender-seasonal-guide"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-0">When should you prune lavender?</h2>
          <p className="mb-6">Pruning timing depends on the variety and the age of the plant. Most common lavenders (English lavenders and many lavandins) respond best to pruning right after flowering — this trims back spent blooms and encourages fresh, bushy growth that will produce next season’s flowers. Avoid cutting hard into old, woody stems because many lavenders do not regenerate well from old wood.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you trim lavender?</h2>
          <p className="mb-6">Trimming is mostly cosmetic: removing spent flower spikes and tidying leggy stems immediately after flowering is ideal. Light trims keep the plant compact and airflow high, which reduces disease. For structural cuts (reducing overall size or rejuvenating old plants), do them cautiously and only when you’re confident there’s healthy green growth low on the stems.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you fertilize lavender?</h2>
          <p className="mb-6">Lavender prefers lean soils. Fertilize sparingly — a light, low-nitrogen feed or a thin layer of well-rotted compost in early spring is usually enough. Excess fertilizer, especially high in nitrogen, promotes soft growth at the expense of fragrance and flowers. Good drainage and soil pH matter more than repeated feeding.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune lavender in spring?</h2>
          <p className="mb-6">Spring pruning should be minimal. Wait until new growth is clearly underway before making any corrective cuts. A light tidy to remove winter-damaged stems is safe once plants begin active growth, but avoid major reshaping in spring because you may remove the shoots that will carry the season’s flower spikes.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune lavender in summer?</h2>
          <p className="mb-6">Yes — but the right moment is important. The best time is immediately after the main flowering flush (typically mid to late summer): deadhead spent blooms and lightly shape the plant. This encourages a neat form and may stimulate a small autumn repeat bloom. Avoid heavy pruning during hot, dry spells that stress the plant.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune lavender in autumn (fall)?</h2>
          <p className="mb-6">Autumn is not the best time for major pruning. Late-season heavy cuts can stimulate tender regrowth that won’t harden off before winter. If you must tidy, only remove dead flower spikes and clearly dead wood; leave shaping and heavier reductions until after the main flowering period when the plant has time to recover.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune lavender in winter?</h2>
          <p className="mb-6">Winter pruning is generally limited to removing obviously dead stems once the plant is fully dormant. Don’t cut into the woody base — those stems help protect the plant and may not reshoot if removed. In colder climates, leaving a tidy canopy through winter also protects crowns from freeze/thaw damage.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Caring for lavender? The most common mistake</h2>
          <p className="mb-6">One of the most common mistakes with lavender care is timing — people plan to prune, feed or protect their lavender, then life gets in the way and the window closes. You probably saw this coming. ForeverFlower exists to solve that problem: our <Link to="/articles/best-free-reminder-apps" className="font-bold text-white underline hover:text-primary">free tier</Link> is perfect for these sorts of gardening reminder needs. Why not just use your calender app? You definitely could. But a single notification is easy to miss. And what if you change phones? We use a notification hierarchy. We’ll start with <Link to="/articles/best-email-reminder-apps" className="font-bold text-white underline hover:text-primary">emails</Link>, then we’ll send you <Link to="/articles/best-text-message-reminder-apps" className="font-bold text-white underline hover:text-primary">texts</Link>. And we’ll keep trying to reach out until you acknowledge us. So that’s the pitch, nothing too complicated. We’d love for you to give it a try. And so would your lavender’s. If you're interested checkout our homepage <Link to="/" className="font-bold text-white underline hover:text-primary">here</Link>.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/caring-for-lavender-seasonal-guide" />
      </section>
    </>
  );
};

export default CaringForLavenderSeasonalGuide;
