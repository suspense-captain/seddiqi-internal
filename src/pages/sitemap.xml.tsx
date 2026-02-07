import { GetServerSideProps } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_HOSTED_URL ?? "https://seddiqi.com";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemaps = [
    "sitemap-product-categories.xml",
    "sitemap-products.xml",
    "sitemap-content.xml",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemaps
      .map(
        (s) => `
      <sitemap>
        <loc>${SITE_URL}/${s}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>`
      )
      .join("")}
  </sitemapindex>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapIndex() {
  return null;
}
