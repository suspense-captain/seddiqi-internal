import { NextApiRequest, NextApiResponse } from "next";
import {
  Customer,
  slasHelpers,
  Product,
  ClientConfig,
  Search,
} from "commerce-sdk";
import { ShopperSearch } from "commerce-sdk-isomorphic"; // commerce-sdk-isomorphic for product search
import initializeShopperConfig, {
  OAuthTokenFromAM,
  clientConfig,
} from "@utils/sfcc-connector/config";
import { transformPriceRefinement } from "@utils/sfcc-connector/productUtils";
import logger from "@utils/logger";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestMethod = req.method;
  const body = req?.body !== "" ? JSON.parse(req?.body) : null;
  const query = req.query.api ?? "";
  const action = req.query.action ?? "";

  switch (query) {
    case "product":
      try {
        if (requestMethod === "POST" && action === "getProducts") {
          const categoryId: string = body;
          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;

          clientConfig.headers["authorization"] = `Bearer ${accessToken}`;

          const currentPage = parseInt(req.query.currentPage as string) || 1;
          const sort = (req.query.sort as string) ?? "";
          const limit = 24;
          const offset = (currentPage - 1) * limit;
          const searchClient = new ShopperSearch(clientConfig);
          const searchResult = await searchClient.productSearch({
            parameters: {
              organizationId: clientConfig.parameters.organizationId,
              siteId: clientConfig.parameters.siteId,
              refine: [`cgid=${categoryId}`],
              limit: limit,
              offset: offset,
              expand: ["images", "custom_properties", "availability"],
              allImages: true,
              sort: sort,
            },
          });

          // console.log({ result });

          if (searchResult.total > 0) {
            var result: any = searchResult;

            return res.status(200).json({ isError: false, response: result });
          } else {
            console.log("No product found.");
            return res
              .status(400)
              .json({ isError: true, response: "No product found." });
          }
        }
      } catch (err) {
        console.error(err);

        return res.status(500).json({ error: "Internal server error" });
      }
      break;
    case "filter":
      try {
        if (requestMethod === "GET" && action === "setProducts") {
          const sort = (req.query.sort as string) ?? "";
          const categoryId = (req.query.categoryId as string) ?? "";
          const filters = JSON.parse(req.query.filters as string) ?? {};
          const currentPage = parseInt(req.query.currentPage as string) ?? 1;
          const limit = parseInt(req.query.limit as string) || 24;
          const offset = (currentPage - 1) * limit;
          const locale = req.query.locale === "undefined" ? "default": req.query.locale;

          // const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
          // const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;

          if (!categoryId) {
            return res
              .status(400)
              .json({ isError: true, response: "Category ID is required." });
          }

          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;
          clientConfig.headers["authorization"] = `Bearer ${accessToken}`;

          // Build the dynamic refine parameters
          const refineParams = [`cgid=${categoryId}`];

          /* if (minPrice !== undefined && maxPrice !== undefined) {
                refineParams.push(`price=(${minPrice}..${maxPrice})`);
              } */

          // Process other filters
          Object.keys(filters).forEach((key) => {
            console.log(`Processing filter key: ${key}`);
            console.log(`Filter values for ${key}:`, filters[key]);
            if (Array.isArray(filters[key]) && filters[key].length > 0) {
              const combinedValues = filters[key].join("|");
              console.log(`Adding filter ${key}=${combinedValues}`);
              refineParams.push(`${key}=${combinedValues}`);
            }
          });

          const options = {
            /** commerce-sdk-isomorphic doesn't require authorization (Only for commerce-sdk)*/
            // headers: {
            //   Authorization: `Bearer ${accessToken}`
            // },
            parameters: {
              organizationId: clientConfig.parameters.organizationId,
              siteId: clientConfig.parameters.siteId,
              refine: refineParams,
              sort: sort,
              expand: ["images", "custom_properties", "availability"],
              allImages: true,
              limit: limit,
              offset: offset,
              locale: Array.isArray(locale) ? locale[0] : locale
            },
          };
          // console.log("OPTIONS: " + JSON.stringify(options, null, 2));

          // TODO: commerce-sdk doesn't support expand and allImages parameters
          // const shopperSearchClient = new Search.ShopperSearch(clientConfig);
          const shopperSearchClient = new ShopperSearch(clientConfig);
          let productResults = await shopperSearchClient.productSearch(options);

          if (productResults.total > 0) {
            productResults = transformPriceRefinement(productResults);
            // console.log("response: "+ JSON.stringify(productResults, null, 2));
            return res
              .status(200)
              .json({ isError: false, response: productResults });
          } else {
            return res
              .status(400)
              .json({ isError: true, response: productResults });
          }
        }
      } catch (err) {
        console.error("Error during product search:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      break;
    case "productDetail":
      try {
        if (requestMethod === "GET" && action === "getProductDetails") {
          let pid = (req.query.pid as string) ?? "";
          pid = pid.replace(/\//g, "%2F");
          const locale = req.query.locale === "undefined" ? "default": req.query.locale;
          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;
          clientConfig.headers["authorization"] = `Bearer ${accessToken}`;
          const shopperProductsClient = new Product.ShopperProducts(
            clientConfig
          );

          const options = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            parameters: {
              organizationId: clientConfig.parameters.organizationId,
              siteId: clientConfig.parameters.siteId,
              id: pid,
              locale: Array.isArray(locale) ? locale[0] : locale
            },
          };

          const productResult = await shopperProductsClient.getProduct(options);
          
          if (!productResult) {
            console.log("No product found.");
            return res.status(400).json({ 
              isError: true, 
              response: "No product found." 
            });
          }

          // Fetch Store Inventories
          if (productResult?.c_storeId) {
            const finalOptions = {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              parameters: {
                organizationId: clientConfig.parameters.organizationId,
                siteId: clientConfig.parameters.siteId,
                id: pid,
                inventoryIds: productResult.c_storeId,
              },
            };

            const finalProductResult = await shopperProductsClient.getProduct(finalOptions);

            return res.status(200).json({ 
              isError: false, 
              response: finalProductResult
            });
          }

          return res.status(200).json({ 
            isError: false, 
            response: productResult 
          });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      break;
    case "productList":
      try {
        if (requestMethod === "GET" && action === "getMultipleProducts") {
          const productIds = (req.query.productIds as string) ?? "";
          const locale = req.query.locale === "undefined" ? "default": req.query.locale;
          // console.log(productIds);
          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;
          clientConfig.headers["authorization"] = `Bearer ${accessToken}`;
          const shopperProductsClient = new Product.ShopperProducts(
            clientConfig
          );

          const options = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            parameters: {
              organizationId: clientConfig.parameters.organizationId,
              siteId: clientConfig.parameters.siteId,
              ids: productIds,
              locale: Array.isArray(locale) ? locale[0] : locale
            },
          };

          const productResult = await shopperProductsClient.getProducts(
            options
          );
          if (productResult) {
            // console.log("Product: " + JSON.stringify(productResult, null, 4));
            return res
              .status(200)
              .json({ isError: false, response: productResult });
          } else {
            console.log("No product found.");
            return res
              .status(400)
              .json({ isError: true, response: "No product found." });
          }
        }
      } catch (err) {
        console.error(err);

        return res.status(500).json({ error: "Internal server error" });
      }
      break;
    default:
      return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
