import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/crepe_myrtle.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';
import { Link } from 'react-router-dom';

const CaringForCrepeMyrtleSeasonalGuide = () => {
  const articleDetails = {
    title: "When & How to Care for Crepe Myrtle (Seasonal Guide)",
    description: "Crepe myrtle care is simple once timing is understood. These shrubs and trees bloom on new growth, so pruning at the right moment encourages abundant flowers and strong structure. Learn when to prune, trim, and fertilize crepe myrtle throughout the year.",
    url: "https://www.foreverflower.app/articles/caring-for-crepe-myrtle-seasonal-guide",
    ogImage: "/static/og-images/og-caring-for-crepe-myrtle-seasonal-guide.webp",
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
        canonicalPath="/articles/caring-for-crepe-myrtle-seasonal-guide"
        ogType="article"
        ogImage={articleDetails.ogImage}
        structuredData={structuredData}
      />
      <ArticleLayout
        title="When & How to Care for Crepe Myrtle (A Seasonal Guide)"
        subtitle={<>Crepe myrtle care is simple once timing is understood. These shrubs and trees bloom on new growth, so pruning at the right moment encourages abundant flowers and strong structure. Over-pruning — especially “topping” — <strong>weakens the plant, reduces bloom quality, and leads to unattractive knobby growth.</strong></>}
        imageSrc={articleImage}
        imageAlt="A crepe myrtle tree in full bloom with vibrant flowers"
        faqPage="caring-for-crepe-myrtle-seasonal-guide"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-0">When should you prune crepe myrtle?</h2>
          <p className="mb-6">Crepe myrtles bloom on new wood, so prune in late winter to very early spring before new growth begins. Pruning earlier risks cold damage to exposed cuts, and pruning later can delay flowering. Remove crossing branches, suckers at the base, and keep the natural branching form — avoid topping or severe heading cuts.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you trim crepe myrtle?</h2>
          <p className="mb-6">Trimming should focus on removing spent flowers and light shaping during the growing season. Deadheading can encourage a second flush of blooms in some climates. Avoid mid- to late-summer heavy trims, as these can stress the plant and produce weak late growth.</p>
          
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">When should you fertilize crepe myrtle?</h2>
          <p className="mb-6">Apply a balanced, slow‑release fertilizer in early spring just before new growth starts. Avoid excessive nitrogen, which encourages leafy growth at the expense of flowers. In rich soils, fertilizer may not be necessary at all. Maintaining good soil structure and consistent moisture during establishment matters more than frequent feeding.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in spring?</h2>
          <p className="mb-6">Yes — early spring is the ideal window, just before new buds break. Remove suckers at the base, thin out crowded branches to maintain good structure, and shape lightly while preserving the natural canopy. Avoid major cuts once leaves emerge, or flowering may be delayed.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in summer?</h2>
          <p className="mb-6">Pruning in summer should be limited to deadheading faded blooms and removing damaged or rubbing branches. Mid‑ to late‑summer heavy pruning encourages tender regrowth that may not harden before autumn, reducing blooms and increasing pest susceptibility.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in autumn (fall)?</h2>
          <p className="mb-6">Avoid pruning in autumn. Cuts stimulate late regrowth that may suffer frost damage. Also, pruning too close to winter makes the plant more vulnerable to cold stress. Leave structural pruning for winter/early spring instead.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Should you prune crepe myrtle in winter?</h2>
          <p className="mb-6">Yes — late winter is the safest time for structural pruning. Remove crossing limbs, root suckers, and any inward‑growing shoots to maintain airflow and shape. Winter is also a good time to correct past improper topping — selectively thin rather than cut everything to the same height.</p>

          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-8">Caring for crepe myrtle? The most common mistake</h2>
          <p className="mb-6">One of the most common mistakes with crepe myrtle care is timing — people plan to prune, feed or protect their crepe myrtles, then life gets in the way and the window closes. You probably saw this coming. ForeverFlower exists to solve that problem: our <Link to="/articles/best-free-reminder-apps" className="font-bold text-white underline hover:text-primary">free tier</Link> is perfect for these sorts of gardening reminder needs. Why not just use your calender app? You definitely could. But a single notification is easy to miss. And what if you change phones? We use a notification hierarchy. We’ll start with <Link to="/articles/best-email-reminder-apps" className="font-bold text-white underline hover:text-primary">emails</Link>, then we’ll send you <Link to="/articles/best-text-message-reminder-apps" className="font-bold text-white underline hover:text-primary">texts</Link>. And we’ll keep trying to reach out until you acknowledge us. So that’s the pitch, nothing too complicated. We’d love for you to give it a try. And so would your crepe myrtles’s. If you're interested checkout our homepage <Link to="/" className="font-bold text-white underline hover:text-primary">here</Link>.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/caring-for-crepe-myrtle-seasonal-guide" />
      </section>
    </>
  );
};

export default CaringForCrepeMyrtleSeasonalGuide;
