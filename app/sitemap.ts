import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://calcsuite.io'; // Replace with actual domain later

  const calculators = [
    'mortgage-calculator',
    'loan-calculator',
    'compound-interest-calculator',
    'debt-payoff-calculator',
    'budget-calculator',
    'retirement-calculator',
    'roi-calculator',
    'credit-card-payoff-calculator',
    'savings-goal-calculator',
    'simple-interest-calculator',
    'inflation-calculator',
    'net-worth-calculator',
    'hourly-to-salary-calculator',
    'emergency-fund-calculator',
    'break-even-calculator',
  ];

  const calcRoutes = calculators.map((calc) => ({
    url: `${baseUrl}/calculators/${calc}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticRoutes, ...calcRoutes];
}
