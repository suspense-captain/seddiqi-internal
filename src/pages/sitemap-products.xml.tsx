import { GetServerSideProps } from "next";
import { getProductListingForSitemap } from "@utils/sfcc-connector/dataService";

const SITE_URL = process.env.NEXT_PUBLIC_HOSTED_URL ?? "https://seddiqi.com";

export const getServerSideProps: GetServerSideProps = async ({
  res,
  locale,
}) => {
  try {
    const limit = 24;
    const categories = ["jewellery", "watches"];
    const allProducts: any[] = [];

    for (const categoryId of categories) {
      const firstResponse = await getProductListingForSitemap({
        categoryId,
        method: "POST",
        currentPage: 1,
      });

      const totalProducts = firstResponse?.response?.total || 0;
      const totalPages = Math.ceil(totalProducts / limit);
      const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

      for (const page of pageNumbers) {
        const response = await getProductListingForSitemap({
          categoryId,
          method: "POST",
          currentPage: page,
        });

        if (response?.response?.hits) {
          allProducts.push(...response.response.hits);
        }
      }
    }

    const urls = allProducts
      .map(
        (product) => `
  <url>
    <loc>${SITE_URL}${locale === "en-ae" ? "" : `/${locale}`}/product/${
          product.productId
        }</loc>
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
  } catch (err) {
    console.error("Product sitemap error:", err);
    return { props: {} };
  }
};

export default function ProductSitemap() {
  return null;
}
