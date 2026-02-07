import { Product, Search, Customer } from "commerce-sdk";
import initializeShopperConfig, { clientConfig } from "./config";
import { NextRequest, NextResponse } from "next/server";
import logger from "@utils/logger";


export async function getProducts(searchQuery) {

  var configWithAuth : any = await initializeShopperConfig();
  configWithAuth = configWithAuth.access_token;

  const searchClient = new Search.ShopperSearch(configWithAuth);
  const searchResults = await searchClient.productSearch({
    parameters: { q: searchQuery },
  });

  const results = [];

  const productsClient = new Product.ShopperProducts(configWithAuth);

  await Promise.all(
    searchResults.hits.map(async (product) => {
      const productResults = await productsClient.getProduct({
        parameters: {
          organizationId: clientConfig.parameters.organizationId,
          siteId: clientConfig.parameters.siteId,
          id: product.productId,
        },
      });

      /* Transform Product Results Here before pusing in the Results Array */

      results.push(productResults);
    }),
  );

  return results;
}



export async function product(pid) {

  const configWithAuth : any = await initializeShopperConfig();
  const accessToken = configWithAuth.access_token;
  clientConfig.headers['authorization'] = `Bearer ${accessToken}`;
  const shopperProductsClient = new Product.ShopperProducts(clientConfig);
  
  const options = {
  headers: {
      Authorization: `Bearer ${accessToken}`
  },
  parameters: {
      organizationId: clientConfig.parameters.organizationId,
      siteId: clientConfig.parameters.siteId,
      id: pid,
      },
  };

  return await shopperProductsClient.getProduct(options); 
}