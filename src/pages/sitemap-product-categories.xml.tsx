import { GetServerSideProps } from "next";
import { getCategory } from "@utils/sfcc-connector/dataService";

const SITE_URL = process.env.NEXT_PUBLIC_HOSTED_URL ?? "https://seddiqi.com";

export const getServerSideProps: GetServerSideProps = async ({
  res,
  locale,
}) => {
  const root = await getCategory({
    method: "GET",
    cgid: "root",
    locale,
  });

  const cats = flatten(root?.response?.categories || []);

  const urls = cats
    .map(
      (cat) => `
      <url>
        <loc>${SITE_URL}${locale === "en-ae" ? "" : `/${locale}` }/products/${cat.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function CategorySitemap() {
  return null;
}

function flatten(categories: any[]): any[] {
  return categories.flatMap((c) => [c, ...flatten(c.categories || [])]);
}
