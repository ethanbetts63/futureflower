from django.contrib.sitemaps import Sitemap

class StaticViewSitemap(Sitemap):
    """
    Sitemap for static pages and frontend-routed articles.
    """
    protocol = 'https'

    def items(self):
        return [
            '/',
            '/login',
            '/contact',
            '/articles',
            '/articles/best-flower-subscription-services-us',
            '/articles/best-flower-subscription-services-au',
            '/articles/best-flower-subscription-services-uk',
            '/articles/best-flower-subscription-services-eu',
            '/articles/best-flower-subscription-services-nz',
            '/articles/best-flower-delivery-perth',
            '/articles/best-flower-delivery-sydney',
            '/articles/best-flower-delivery-adelaide',
            '/articles/best-flower-delivery-darwin',
            '/articles/best-flower-delivery-melbourne',
        ]

    def location(self, item):
        return item

    def changefreq(self, item):
        if item == '/' or item == '/articles':
            return 'weekly'
        return 'monthly'

    def priority(self, item):
        if item == '/':
            return 1.0
        if item == '/articles':
            return 0.8
        return 0.7
