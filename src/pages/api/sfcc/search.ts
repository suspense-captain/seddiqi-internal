import { NextApiRequest, NextApiResponse } from "next";
import { Search } from "commerce-sdk";
import initializeShopperConfig, { clientConfig } from "@utils/sfcc-connector/config";
import { CmsContext } from '@contexts/cmsContext';
import { CmsContent } from '@utils/cms/utils';
import { stringify } from 'querystring';
import { createAppContext } from '@contexts/appContext';
import { getCustomPreferenceValue } from "@utils/sfcc-connector/dataService";

export type CmsRequest = {
  filterBy: { path: string; value: any }[];
  page?: {
      size: number;
      cursor?: string;
  };
};


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestMethod = req.method;
  const categoryId = (req.query.cgid as string) ?? "";
  const searchPhrase = (req.query.search as string) ?? "";
  const query = req.query.api ?? "";
  const action = req.query.action ?? "";

  switch (query) {
    case "search":
      try {
        if (requestMethod === "GET" && action === "getProducts") {
          const limit = req.query.limit === "undefined" ? 25 : Number(req.query.limit);
          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;
          clientConfig.headers['authorization'] = `Bearer ${accessToken}`;
          const refineParams = [`cgid=${categoryId}`];
          var popularSearch : any = null, popularBrands : any = null;
          /** search query is empty :  selecting category tabs 
           * get the category id i.e. Watches or Jewellery
           * get the popular brands and recent search from the custom preferences
          */

          if (searchPhrase === '') {
            if (categoryId.toLowerCase().indexOf('watches') !== -1) {
              popularSearch = await getCustomPreferenceValue({ method: 'GET', preferenceId: 'watchesPopularSearch'});
              popularBrands  = await getCustomPreferenceValue({ method: 'GET', preferenceId: 'watchesPopularBrands'});
            } else {
              popularSearch = await getCustomPreferenceValue({ method: 'GET', preferenceId: 'jewelleryPopularSearch'});
              popularBrands = await getCustomPreferenceValue({ method: 'GET', preferenceId: 'jewelleryPopularBrands'});
            }
            popularSearch = !popularSearch.isError ? popularSearch.response : null;
            popularBrands = !popularBrands.isError ? popularBrands.response : null;
          }

          const options = {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                },
                parameters: {
                  organizationId: clientConfig.parameters.organizationId,
                  siteId: clientConfig.parameters.siteId,
                  refine: refineParams,
                  q: searchPhrase,
                  limit: limit
                },
            };

          const shopperSearchClient = new Search.ShopperSearch(clientConfig);
          const productResults = await shopperSearchClient.productSearch(options);
          productResults.popularSearch = popularSearch;
          productResults.popularBrands = popularBrands;

          if (productResults.total > 0) {
            // console.log("Search Result(s): " + JSON.stringify(productResults, null, 4));
            return res.status(200).json({ isError: false, response: productResults, });
          } else {
            // console.log("No matching result found");
            return res.status(404).json({ isError: true, response: productResults });
          }
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      break;
    case "suggestion":
        try {
            if (requestMethod === "GET" && action === "getSuggestions") {
                const configWithAuth = await initializeShopperConfig();
                const accessToken = configWithAuth.access_token;
                clientConfig.headers['authorization'] = `Bearer ${accessToken}`;

                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    parameters: {
                        organizationId: clientConfig.parameters.organizationId,
                        siteId: clientConfig.parameters.siteId,
                        q: searchPhrase,
                    },
                };

                const shopperSearchClient = new Search.ShopperSearch(clientConfig);
                const searchSuggestions = await shopperSearchClient.getSearchSuggestions(options);
                const productSuggestions = searchSuggestions.productSuggestions.products ? searchSuggestions.productSuggestions.products.length : 0;

                if (productSuggestions) {
                    console.log("Search Suggestion(s): " + JSON.stringify(searchSuggestions, null, 4));
                    return res.status(200).json({ isError: false, response: searchSuggestions });
                } else {
                    console.log("No search suggestions found");
                    return res.status(404).json({ isError: true, response: searchSuggestions });
                }
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        break;
        case "content":
          try {
            if (requestMethod === "POST" && action === "contentSearch") {
              const { cms } = await createAppContext();
              const host = `${cms.hubName}.cdn.content.amplience.net`;
              const parameters = { depth: "all", format: "inlined" };
              const request = {
                filterBy: [
                  {
                    path: "/_meta/schema",
                    value: "https://seddiqi.amplience.com/component/article-list-carousel"
                  }
                ]
              };

              const body = JSON.stringify({
                ...request,
                parameters,
              });
              const response = await fetch(`https://${host}/content/filter`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: body
              });
              const content = await response.json();
              
              if (content.page.responseCount > 0) {
                console.log("content search: " + JSON.stringify(content.responses, null, 4));
                return res.status(200).json({ isError: false, response: content.responses });
              } else {
                console.log("No content found.");
                return res.status(400).json({ isError: true, response: "No content found." });
              }
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ 
              isError: true ,
              body: JSON.stringify({ msg: err })
            });
        }
        break;
    default:
      return res.status(400).json({ isError: true });
  }
};

export default handler;
