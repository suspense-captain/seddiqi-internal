import { NextApiRequest, NextApiResponse } from "next";
import { Product, Search } from "commerce-sdk";
import initializeShopperConfig, { clientConfig } from "@utils/sfcc-connector/config";
import { getCategory } from "@utils/sfcc-connector/dataService";
import { transformPriceRefinement } from "@utils/sfcc-connector/productUtils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";
    const categoryId = (req.query.cgid as string) ?? "";

    switch (query) {
        case "category":
            try {
                if (requestMethod === "GET" && action === "getCategory") {
                    const configWithAuth = await initializeShopperConfig();
                    const accessToken = configWithAuth.access_token;
                    clientConfig.headers['authorization'] = `Bearer ${accessToken}`;
                    const shopperProductsClient = new Product.ShopperProducts(clientConfig);
                    const localeIsUndefined = req.query.locale === "undefined";
                    const locale = localeIsUndefined ? "default" : req.query.locale as string;

                    const options = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        },
                        parameters: {
                            organizationId: clientConfig.parameters.organizationId,
                            siteId: locale.toLowerCase().includes("-sa") ? process.env.SFDC_SITEIDKSA : process.env.SFDC_SITEID,
                            id: categoryId,
                            locale: locale === "en-AE" || locale === "en-SA" ? "default"
                            :locale === "ar-AE" ||locale === "ar-SA"
                            ? "ar-AE"
                            :locale
                        },
                    };

                    const categoryResults = await shopperProductsClient.getCategory(options);
                    if (categoryResults) {
                        // console.log("Categories : " + JSON.stringify(categoryResults, null, 4));
                        return res.status(200).json({ isError: false, response: categoryResults });
                    } else {
                        console.log("No category found.");
                        return res.status(400).json({ isError: true, response: "No category found." });
                    }
                }

            } catch(err) {
                console.error(err);
      
                return res.status(500).json({ error: 'Internal server error' });
            }
        break;
        case "filters":
            try {
                if (requestMethod === "GET" && action === "getFilters") {
                    const locale = req.query.locale === "undefined" ? "default": req.query.locale;
                    const configWithAuth =await initializeShopperConfig();
                    const accessToken = configWithAuth.access_token;
                    clientConfig.headers['authorization'] = `Bearer ${accessToken}`;
                    const refineParams = [`cgid=${categoryId}`];

                    const options = {
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        },
                        parameters: {
                          organizationId: clientConfig.parameters.organizationId,
                          siteId: clientConfig.parameters.siteId,
                          refine: refineParams,
                          locale: Array.isArray(locale) ? locale[0] : locale
                        },
                    };

                    const shopperSearchClient = new Search.ShopperSearch(clientConfig);
                    var categoryResults = await shopperSearchClient.productSearch(options);
                    const result : any = {};
                    // console.log("category results: "+ categoryResults.total);

                    if (categoryResults.total > 0) {
                        categoryResults = transformPriceRefinement(categoryResults);
                        result.refinements = categoryResults.refinements;
                        result.sortingOptions = categoryResults.sortingOptions;

                        /** Get quick filters 
                         * compare the category quick filter label with all available filter
                         * return the label with attribute Id 
                        */
                        //console.log("category ID: ", categoryId);
                        const category = await getCategory({ method: "GET", cgid: categoryId});
                        if (!category.isError && category.response && category.response.c_categoryQuickFilters && category.response.c_categoryQuickFilters.length > 0) {
                            console.log("c_categoryQuickFilters", category.response.c_categoryQuickFilters);
                            const categoryQFilters = category.response.c_categoryQuickFilters;
                            const filters = result.refinements;
                            var quickFilters = [];

                            filters.forEach(filter => {
                                if (filter.attributeId !== 'price' && filter.values) {
                                    filter.values.forEach(value => {
                                        // If the label matches one of the filter value, searching for
                                        if (categoryQFilters.includes(value.label)) {
                                            quickFilters.push({
                                                attributeId: filter.attributeId,
                                                label: value.label
                                            });
                                        }
                                    });
                                }
                            });
                            // console.log("Quick Filters: ", quickFilters);
                            if (quickFilters.length) {
                                result.quickFilters = quickFilters;
                            }
                        }
                        // console.log("Refinements : " + JSON.stringify(result, null, 4));
                        return res.status(200).json({ isError: false, response: result });
                    } else {
                        console.log("No filters found.");
                        return res.status(400).json({ isError: true, response: categoryResults });
                    }
                }

            } catch(err) {
                console.error(err);
      
                return res.status(500).json({ error: 'Internal server error' });
            }
        break;
        default:
            return res.status(400).json({ isError: true });
    }
}

export default handler;
