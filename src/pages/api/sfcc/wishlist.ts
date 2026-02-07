import { NextApiRequest, NextApiResponse } from 'next'
import { Customer } from "commerce-sdk";
import { clientConfig } from "@utils/sfcc-connector/config";
import { createWishlist, getWishlist } from "@utils/sfcc-connector/dataService";
 
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";

    switch (query) {
        case "createWishlist":
                try {
                    if (requestMethod === "POST" && action === "createNewList") {
                        const customerId = req.query.customerId as string;
                        const access_token = req.query.accessToken as string;
    
                        clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                        const client = new Customer.ShopperCustomers(clientConfig);

                        const options = {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                            parameters: {
                                siteId: clientConfig.parameters.siteId,
                                organizationId: clientConfig.parameters.organizationId,
                                customerId: customerId,
                            },
                            body: {
                                creationDate: new Date(),
                                type: 'wish_list',
                                public: true,
                                name: 'My Wishlist'
                            }
                        };

                        const productList = await client.createCustomerProductList(options);
                        return res.status(200).json({ isError: false, response: productList });
                    }
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ 
                        isError: true, 
                        response: err 
                    });
                }
            break;
        case "addItemToWishlist":
            try {
                if (requestMethod === "POST" && action === "addProduct") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const productId = req.query.productId as string;
                    var listId : string;

                    // check if there is any existing wishlist
                    const wishlist = await getWishlist({ method: "GET", customerId: customerId, access_token: access_token });
                    if (wishlist.response.total > 0) {
                        listId = wishlist.response.data[0].id;
                    } else { // create a new wishlist, if there isn't any list 
                        const wishlist = await createWishlist({ method: "POST", customerId: customerId, access_token: access_token });
                        listId = wishlist.response.id;
                    }

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            listId: listId,
                        },
                        body: {
                            type: 'product',
                            public: true,
                            productId: productId,
                            quantity: 1,
                            priority: 1,
                        }
                    };

                    const productList = await client.createCustomerProductListItem(options);
                    return res.status(200).json({ isError: false, response: productList });
                }
            } catch (err) {
                console.error(err);

                return res.status(500).json({ 
                    isError: true, 
                    response: err 
                });
            }
            break;
        case "removeItemFromWishlist":
            try {
                if (requestMethod === "DELETE" && action === "RemoveProduct") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const productId = req.query.productId as string;
                    var listId : string;
                    var itemId : string;

                    // Get the list Id
                    const wishlist = await getWishlist({ method: "GET", customerId: customerId, access_token: access_token });
                    if (wishlist.response.total > 0) {
                        listId = wishlist.response.data[0].id;

                        /** Get the corresponding itemId USING productId */
                        const wishlistItems = wishlist.response.data[0].customerProductListItems;
                        const matchingItem = wishlistItems.find(item => item.productId === productId);

                        if (matchingItem) {
                            itemId = matchingItem.id;
                        } else {
                            console.error("No item found in the wishlist");
                            return res.status(500).json({ 
                                isError: true, 
                                response: "Not found"
                            });
                        }

                    }

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            listId: listId,
                            itemId: itemId,
                        },
                    };

                    const productList = await client.deleteCustomerProductListItem(options);
                    return res.status(200).json({ isError: false, response: productList });
                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({ 
                    isError: true, 
                    response: err 
                });
            }
            break;
        case "getWishlist":
            try {
                if (requestMethod === "GET" && action === "getLists") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                        },
                    };

                    const productList = await client.getCustomerProductLists(options);
                    return res.status(200).json({ isError: false, response: productList });

                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({ 
                    isError: false, 
                    response: err 
                });
            }
            break;
        case "deleteWishlist":
            try {
                if (requestMethod === "DELETE" && action === "deleteList") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    var listId : string;

                    // Get the list Id
                    const wishlist = await getWishlist({ method: "GET", customerId: customerId, access_token: access_token });
                    if (wishlist.response.total > 0) {
                        listId = wishlist.response.data[0].id; // TODO: in future multiple lists will be allowed 
                    }

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            listId: listId,
                        },
                    };

                    const productList = await client.deleteCustomerProductList(options);
                    return res.status(200).json({ isError: false, response: productList });

                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({ 
                    isError: true, 
                    response: err 
                });
            }
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
    }
}

export default handler;