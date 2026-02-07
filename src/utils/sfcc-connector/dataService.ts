import { NextRequest, NextResponse } from "next/server";
import logger from "@utils/logger";
import isServer from "@utils/helpers/isServer";
import { transformTechSpecsDetails } from "./transformation";
import { standardizeLocale } from "@utils/helpers";

export async function registerCustomer({
  userData,
  method,
}: {
  userData: any;
  method: string;
}) {
  try {
    const json = {
      api: "register",
      action: "registerCustomer",
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function loginCustomer({
  userData,
  method,
}: {
  userData: any;
  method: string;
}) {
  try {
    const json = {
      api: "login",
      action: "loginCustomer",
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "login");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function passwordlessLoginCustomer({
  userData,
  method,
}: {
  userData: any;
  method: string;
}) {
  try {
    const json = {
      api: "passwordlessLogin",
      action: "passwordlessLoginCustomer",
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "login");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function passwordlessAccessToken({
  userData,
  method,
}: {
  userData: any;
  method: string;
}) {
  try {
    const json = {
      api: "passwordlessAccessToken",
      action: "getAccessToken",
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "login");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function updateCustomer({
  userData,
  method,
  customerId,
  access_token,
}: {
  userData: any;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "updateProfile",
      action: "updateCustomer",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
      body: JSON.stringify(userData),
    };

    // console.log("config: ", config);

    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function createCustomerAddress({
  userData,
  method,
  customerId,
  access_token,
}: {
  userData: any;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "newAddress",
      action: "createAddress",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function updateCustomerAddress({
  userData,
  addressName,
  method,
  customerId,
  access_token,
}: {
  addressName: string;
  method: string;
  customerId: string;
  access_token: string;
  userData: any;
}) {
  try {
    const json = {
      api: "updateAddress",
      action: "updateCustomerAddress",
      customerId: customerId,
      accessToken: access_token,
      addressName: addressName,
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getCustomerAddress({
  addressName,
  method,
  customerId,
  access_token,
}: {
  addressName: string;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "address",
      action: "getAddress",
      customerId: customerId,
      accessToken: access_token,
      addressName: addressName,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function removeCustomerAddress({
  addressName,
  method,
  customerId,
  access_token,
}: {
  addressName: string;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "removeAddress",
      action: "removeAddress",
      customerId: customerId,
      accessToken: access_token,
      addressName: addressName,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function updateCustomerPassword({
  userData,
  method,
  customerId,
  access_token,
}: {
  userData: any;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "password",
      action: "updatePassword",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function deleteCustomerAccount({
  emailAddress,
  method,
  customerId,
  access_token,
}: {
  emailAddress: string;
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "account",
      action: "deleteShopper",
      customerId: customerId,
      accessToken: access_token,
      emailAddress: emailAddress,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getPasswordResetToken({
  method,
  userId,
}: {
  method: string;
  userId: string;
}) {
  try {
    const json = {
      api: "resetPassword",
      action: "resetToken",
      userId: userId,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function resetPassword({
  method,
  userId,
  codeVerifier,
  userData,
}: {
  method: string;
  userId: string;
  codeVerifier: string;
  userData: any;
}) {
  try {
    const json = {
      api: "setPassword",
      action: "resetPassword",
      userId: userId,
      codeVerifier: codeVerifier,
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function logoutCustomer({
  userData,
  method,
}: {
  userData: any;
  method: string;
}) {
  try {
    const json = {
      api: "logout",
      action: "logoutCustomer",
    };
    const config = {
      method: method,
      body: userData,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "login");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export const getCustomer = async (
  customerId: string,
  access_token: string
): Promise<any> => {
  try {
    const json = {
      api: "customer",
      action: "getCustomer",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: "GET",
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customer");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
};

export async function getProductListing({
  categoryId,
  method,
  currentPage,
  sort,
}: {
  categoryId: any;
  method: string;
  currentPage: any;
  sort?: string;
}) {
  try {
    const json = {
      api: "product",
      action: "getProducts",
      currentPage: currentPage,
      sort: sort,
    };
    const config = {
      method: method,
      body: JSON.stringify(categoryId),
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "product");


    if (!res) {
      return null;
    }

    return res.response;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getCategoryFilters({
  cgid,
  method,
  locale,
}: {
  cgid: any;
  method: string;
  locale?: string;
}) {
  try {
    const json = {
      api: "filters",
      action: "getFilters",
      cgid: cgid,
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();

    const res = await serverApiCallSfcc(`?${queryString}`, config, "category");

    // console.log({res});

    if (!res) {
      return null;
    }

    return res.response;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function setFilters({
  method,
  categoryId,
  filters,
  currentPage,
  sort,
  limit,
  locale,
}: {
  method: string;
  categoryId?: string;
  filters?: any;
  currentPage?: string;
  sort?: string;
  limit?: string;
  locale?: string;
}) {
  try {
    const json: any = {
      api: "filter",
      action: "setProducts",
      categoryId: categoryId,
      filters: JSON.stringify(filters),
      sort: sort,
      currentPage: currentPage,
      limit: limit,
      locale: standardizeLocale(locale),
    };

    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();

    const res = await serverApiCallSfcc(`?${queryString}`, config, "product");

    // console.log({ res });

    if (!res) {
      return null;
    }

    return res.response;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getProductDetails({
  productId,
  method,
  locale,
}: {
  productId: string;
  method: string;
  locale?: string;
}) {
  try {
    const json = {
      api: "productDetail",
      action: "getProductDetails",
      pid: productId,
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "product");

    if (res.isError) {
      return {
        error: true,
      };
    }

    const techSpecs = transformTechSpecsDetails(res.response);

    return { ...res, techSpecs };
    //return {...res};
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getProducts({
  pids,
  method,
  locale,
}: {
  pids: any;
  method: string;
  locale?: string;
}) {
  try {
    const json = {
      api: "productList",
      action: "getMultipleProducts",
      productIds: pids,
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();

    const res = await serverApiCallSfcc(`?${queryString}`, config, "product");

    // console.log({ res });

    if (!res) {
      return null;
    }

    return res.response;
  } catch (err) {
    logger.error("API threw Error", err);
    throw err;
  }
}

export async function getInventory({
  productIds,
  inventoryIds,
  method,
}: {
  productIds: string;
  inventoryIds?: string;
  method: string;
}) {
  try {
    const json = {
      api: "inventory",
      action: "getInventory",
      productIds: productIds,
      ...(inventoryIds && { inventoryIds: inventoryIds }),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();

    const res = await serverApiCallSfcc(`?${queryString}`, config, "product");

    if (!res) {
      return null;
    }

    return res.response;
  } catch (err) {
    logger.error("API threw Error", err);
    throw err;
  }
}

export async function getSearchResults({
  query,
  categoryId,
  method,
  limit
}: {
  query: string;
  categoryId: string;
  method: string;
  limit?: string;
}) {
  try {
    const json = {
      api: "search",
      action: "getProducts",
      search: query,
      cgid: categoryId,
      limit: limit,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "search");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getSearchSuggestions({
  query,
  method,
}: {
  query: string;
  method: string;
}) {
  try {
    const json = {
      api: "suggestion",
      action: "getSuggestions",
      search: query,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "search");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getContentSearch({
  query,
  method,
}: {
  query: string;
  method: string;
}) {
  try {
    const json = {
      api: "content",
      action: "contentSearch",
      search: query,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "search");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getStores({
  method,
  brand,
  city,
  name,
  service,
  lat,
  lng,
  storeIds,
  locale
}: {
  method: string;
  brand: string;
  city: string;
  name: string;
  service: string;
  lat: string;
  lng: string;
  storeIds?: string;
  locale?: string;
}) {
  try {
    const json = {
      api: "search",
      action: "getStores",
      ...(brand && { brand }), // Include brand filter if provided
      ...(city && { city }), // Include city filter if provided
      ...(name && { name }), // Include location filter if provided
      ...(service && { service }), // Include available service filter if provided
      lat: lat,
      lng: lng,
      storeIds: storeIds,
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "store");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getCategory({
  method,
  cgid,
  locale,
}: {
  method: string;
  cgid: string;
  locale?: string;
}) {
  try {
    const json = {
      api: "category",
      action: "getCategory",
      cgid: cgid,
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "category");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function subscribedToNewsletter({
  method,
  userData,
  locale
}: {
  method: string;
  userData: any;
  locale?: string;
}) {
  try {
    const json = {
      api: "newsletter",
      action: "subscription",
      locale: standardizeLocale(locale),
    };
    const config = {
      method: method,
      body: JSON.stringify(userData),
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(
      `?${queryString}`,
      config,
      "newsletter"
    );
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function contactUs({
  method,
  userData,
  locale
}: {
  method: string;
  userData: any;
  locale?: string
}) {
  try {
    const json = {
      api: "contact",
      action: "contactUsSubmission",
      locale,
    };
    const config = {
      method: method,
      body: userData,
    };

    // console.log("USERDATA", userData)
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "contact");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getCustomPreferenceValue({
  method,
  preferenceId,
}: {
  method: string;
  preferenceId: string;
}) {
  try {
    const json = {
      api: "getPreference",
      action: "getCustomPreferenceValue",
      preferenceId: preferenceId,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(
      `?${queryString}`,
      config,
      "preferences"
    );
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function createWishlist({
  method,
  customerId,
  access_token,
}: {
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "createWishlist",
      action: "createNewList",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "wishlist");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function addProductToWishlist({
  method,
  customerId,
  access_token,
  productId,
}: {
  method: string;
  customerId: string;
  access_token: string;
  productId: string;
}) {
  try {
    const json = {
      api: "addItemToWishlist",
      action: "addProduct",
      customerId: customerId,
      accessToken: access_token,
      productId: productId,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "wishlist");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function removeProductFromWishlist({
  method,
  customerId,
  access_token,
  productId,
}: {
  method: string;
  customerId: string;
  access_token: string;
  productId: string;
}) {
  try {
    const json = {
      api: "removeItemFromWishlist",
      action: "RemoveProduct",
      customerId: customerId,
      accessToken: access_token,
      productId: productId,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "wishlist");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getWishlist({
  method,
  customerId,
  access_token,
}: {
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "getWishlist",
      action: "getLists",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "wishlist");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function deleteWishlist({
  method,
  customerId,
  access_token,
}: {
  method: string;
  customerId: string;
  access_token: string;
}) {
  try {
    const json = {
      api: "deleteWishlist",
      action: "deleteList",
      customerId: customerId,
      accessToken: access_token,
    };
    const config = {
      method: method,
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "wishlist");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function getCustomObject({
  objectType,
  objectKey,
  locale
}: {
  objectType: string;
  objectKey: string;
  locale?: any;
}) {
  try {
    const json = {
      api: "customObjects",
      action: "getCustomObject",
      objectType: objectType,
      objectKey: objectKey,
      locale
    };
    const config = {
      method: "GET",
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customObjects");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function createCustomObject({
  objectType,
  userData,
  locale
}: {
  objectType: string;
  userData: object;
  locale?: any
}) {
  try {
    const json = {
      api: "customObjects",
      action: "createCustomObject",
      objectType: objectType,
      locale
    };
    const config = {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData)
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customObjects");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

export async function updateCustomObject({
  objectType,
  userData,
  locale
}: {
  objectType: string;
  userData: object;
  locale?: any;
}) {
  try {
    const json = {
      api: "customObjects",
      action: "updateCustomObject",
      objectType: objectType,
      locale
    };
    const config = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData)
    };
    const queryString = new URLSearchParams(json).toString();
    const res = await serverApiCallSfcc(`?${queryString}`, config, "customObjects");
    return res;
  } catch (err) {
    logger.error("API threw Error", err);

    throw err;
  }
}

let apiConfig: any;

const cacheApiConfig = () => {
  if (!isServer()) {
    return "";
  }

  if (!apiConfig) {
    apiConfig = process.env.NEXT_PUBLIC_HOSTED_URL || "http://localhost:3000";
  }

  logger.log("apiConfig ===> ", apiConfig);

  return apiConfig;
};

/** This is the fetch call to the pages > api */
const serverApiCallSfcc = async (query: string, config: any, type: string) => {
  try {
    const res = await fetch(
      `${cacheApiConfig()}/api/sfcc/${type}${query}`,
      config
    );

    if (!res.ok) {
      if (res.status >= 500 && res.status < 600) {
        throw new Error("Internal server error occurred");
      }
    }
    return await res.json();
  } catch (err) {
    throw err;
  }
};

export const serverApiCallSfccSitemap = async (query: string, config: any, type: string) => {
  const controller = new AbortController();
  const timeoutMs = 10 * 60 * 1000; 
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${cacheApiConfig()}/api/sfcc/${type}${query}`, {
      ...config,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
};

export const getProductListingForSitemap = async (options: { categoryId: string; method: string; currentPage: number }) => {

  const query = `?api=product&action=getProducts&currentPage=${options.currentPage}`;
  const config = { method: options.method,  body: JSON.stringify(options.categoryId), };
  return serverApiCallSfccSitemap(query, config, "product");
};

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
// eslint-disable-next-line no-unused-vars
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
