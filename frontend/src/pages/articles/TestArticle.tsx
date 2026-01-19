import { ArticleLayout } from '../../components/ArticleLayout';
import articleImage from '../../assets/delivery.webp';
import { ArticleCarousel } from '../../components/ArticleCarousel';
import Seo from '../../components/Seo';

const TestArticle = () => {
  const articleDetails = {
    title: "Test Article | ForeverFlower",
    description: "This is a test article.",
    url: "https://www.foreverflower.app/articles/test-article",
    ogImage: "/static/og-images/og-reminder-apps-ranked.webp",
    authorName: "The ForeverFlower Team",
    publisherName: "ForeverFlower",
    publisherLogoUrl: "https://www.foreverflower.app/static/logo_128_black.png",
    datePublished: "2026-01-19T00:00:00Z",
    dateModified: "2026-01-19T00:00:00Z",
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
        canonicalPath="/articles/test-article"
        ogType="article"
        ogImage={articleDetails.ogImage}
        structuredData={structuredData}
      />
      <ArticleLayout
        title="Test Article"
        subtitle={<><span className="font-bold italic underline">Article Summary:</span> This is a summary of the test article.</>}
        imageSrc={articleImage}
        imageAlt="A test image"
        faqPage="test-article"
      >
        <div className="text-lg text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight mb-4 mt-0">This is a Test Article</h2>
          <p className="mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </ArticleLayout>
      <section className="mt-16">
        <ArticleCarousel exclude="/articles/test-article" />
      </section>
    </>
  );
};

export default TestArticle;
