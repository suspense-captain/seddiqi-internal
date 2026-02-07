import { fetchAmplienceDataBySchema } from "@utils/helpers/fetchAmplienceDataBySchema";
import { GetServerSideProps } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_HOSTED_URL ?? "https://seddiqi.com";
const SCHEMA_URL = "https://seddiqi.amplience.com";

const SCHEMAS = [
  `${SCHEMA_URL}/page/rolex/content-page`,
  `${SCHEMA_URL}/page/brand-page`,
  `${SCHEMA_URL}/page/content-page`,
  `${SCHEMA_URL}/page/blog-page`,
];

export const getServerSideProps: GetServerSideProps = async ({
  res,
  locale,
}) => {
  let urls: string[] = [];

  for (const schema of SCHEMAS) {
    const filterBy = [
      {
        path: "/_meta/schema",
        value: schema,
      },
    ];

    const cmsContext = {
      locale: locale,
    };

    const results =
      (await fetchAmplienceDataBySchema(cmsContext, filterBy)) || [];

    results
      .filter((item) => {
        const key = item.content?._meta?.deliveryKey?.toLowerCase() || "";

        if (locale.toLowerCase() === "en-ae") {
          return !key.match(/^[a-z]{2}-[a-z]{2}\//);
        } else {
          return key.startsWith(`${locale.toLowerCase()}/`);
        }
      })
      .forEach((item) => {
        const slug = item.content?._meta?.deliveryKey; // fallback if no slug
        if (!slug || slug.toLowerCase() === "homepage") return;

        const lastmod = item.content?.lastModified || new Date().toISOString();

        urls.push(`
            <url>
              <loc>${SITE_URL}/${slug}</loc>
              <lastmod>${lastmod}</lastmod>
            </url>
        `);
      });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${SITE_URL}</loc>
      <priority>1.0</priority>
    </url>
    ${urls.join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
