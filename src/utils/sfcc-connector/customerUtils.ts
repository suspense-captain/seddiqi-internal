import { Customer, slasHelpers } from 'commerce-sdk'
import initializeShopperConfig, { clientConfig, getGuestTokenResponse, getShopperTokenResponse } from '@utils/sfcc-connector/config'
import { createHash } from 'crypto';

/** Update customer profile with golden ID **/
async function saveGoldenIDToCustomerProfile (customer: any, goldenID: any) {
  const shopperJWT = await getShopperTokenResponse({
      usid: customer.usid,
      username: customer.login,
      password: customer.currentPassword,
  });
  /* TODO: Once the API is finalied for golden ID, use the below code for setting up the golden ID in customer profile
  clientConfig.headers['authorization'] = `Bearer ${shopperJWT.access_token}`;
  const options = {
    headers: {
      Authorization: `Bearer ${shopperJWT.access_token}`,
    },
    parameters: {
      siteId: clientConfig.parameters.siteId,
      organizationId: clientConfig.parameters.organizationId,
      customerId: customer.customerId,
    },
    body: {
      c_sfCustomerGoldenId: goldenID,
    }
  }

  // UPDATE: customer golden ID into SFCC customer profile
  const client = new Customer.ShopperCustomers(clientConfig);
  const profile = await client.updateCustomer(options);
  // console.log("UPDATE CUSTOMER: "+ JSON.stringify(profile, null, 4));*/
  return shopperJWT;
};

export async function generateRandomString(length) {
  let text = ""
  const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export async function generateCodeChallenge(codeVerifier) {
  return createHash("sha256")
      .update(codeVerifier)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
}

export default saveGoldenIDToCustomerProfile;
