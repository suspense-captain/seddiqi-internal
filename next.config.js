const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/assets/styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bldb-001.dx.commercecloud.salesforce.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "cdn.media.amplience.net",
      },
      {
        protocol: "https",
        hostname: "**.staging.bigcontent.io",
      },
      {
        protocol: "https",
        hostname: "amp.a.bigcontent.io",
      },
      {
        protocol: "https",
        hostname: "zaeger.com.au",
      },
      {
        protocol: "https",
        hostname: "edge.disstg.commercecloud.salesforce.com",
      },
    ],
  },
  i18n: {
    locales: ["en-ae", "ar-ae", "en-sa", "ar-sa"],
    defaultLocale: "en-ae",
  },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
