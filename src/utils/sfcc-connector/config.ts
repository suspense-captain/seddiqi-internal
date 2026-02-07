import { Customer, slasHelpers } from "commerce-sdk";
import { TokenResponse } from "commerce-sdk/dist/helpers/slasClient";
import { generateRandomString, generateCodeChallenge }from "@utils/sfcc-connector/customerUtils";

export const clientConfig = {
  headers: {},
  parameters: {
    clientId: process.env.SFDC_CLIENT_ID,
    clientSecret: process.env.SFDC_SECRET,
    organizationId: process.env.SFDC_ORGANIZATIONID,
    shortCode: process.env.SFDC_SHORTCODE,
    siteId: process.env.SFDC_SITEID,
  },
  fetchOptions: {
    redirect: "manual",
  },
};

export const AccountMgrConfig = {
  parameters: {
    clientId: process.env.ACCOUNT_MGR_CLIENT_ID,
    password: process.env.ACCOUNT_MGR_PASSWORD,
    realmId: process.env.SFCC_REALM_ID,
    instanceId: process.env.SFCC_INSTANCE_ID,
    scopes: process.env.SFCC_OAUTH_SCOPES,
    api: process.env.SFCC_OAUTH_API_URL,
  },
};

export const middlewareConfig = {
  parameters: {
    client_id: process.env.MIDDLEWARE_CLIENT_ID,
    client_secret: process.env.MIDDLEWARE_CLIENT_SECRET,
    storeCode: process.env.MIDDLEWARE_STORE_CODE,
    x_correlation_id: process.env.MIDDLEWARE_CORRELATION_ID,
    source: process.env.MIDDLEWARE_SOURCE,
    api: process.env.MIDDLEWARE_API_URL
  },
};

export default async function initializeShopperConfig() {
  const credentials = `${clientConfig.parameters.clientId}:${clientConfig.parameters.clientSecret}`;
  const base64data = Buffer.from(credentials).toString("base64");
  const client = new Customer.ShopperLogin(clientConfig);
  const options = {
    headers: {
      Authorization: `Basic ${base64data}`
    },
    parameters: {
      organizationId: clientConfig.parameters.organizationId,
    },
    body: {
        client_id: clientConfig.parameters.clientId,
        channel_id: clientConfig.parameters.siteId,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "client_credentials"
      },
  };

  const guestTokenResponse = await client.getAccessToken(options);
  if (guestTokenResponse.access_token) {
    return guestTokenResponse;
  } else {
    console.log("Error fetching token for guest login");
  }
}

export async function basicAuthorization() {
  const credentials = `${clientConfig.parameters.clientId}:${clientConfig.parameters.clientSecret}`;
  const base64data = Buffer.from(credentials).toString("base64");

  return base64data;
}

/** Get OAuth token from account manager */

export async function OAuthTokenFromAM() {
  const credentials = `${AccountMgrConfig.parameters.clientId}:${AccountMgrConfig.parameters.password}`;
  const base64data = Buffer.from(credentials).toString("base64");
  const OAuthBaseUrl = `${AccountMgrConfig.parameters.api}`;

  const headers = {
    'Authorization': `Basic ${base64data}`,
    'Content-Type' : 'application/x-www-form-urlencoded',
  }
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: `SALESFORCE_COMMERCE_API:${AccountMgrConfig.parameters.realmId}_${AccountMgrConfig.parameters.instanceId} ${AccountMgrConfig.parameters.scopes}`
  });

  const accountMgrAccessToken : any = await fetch(OAuthBaseUrl, {
    method: 'POST',
    headers,
    body: body.toString()
  })
  .then((accountMgrAccessToken) => {
    console.log("Account Manager Access token: ", accountMgrAccessToken);
    return accountMgrAccessToken;
  })
  .catch(error => console.log("Error fetching access token for account manager: ", error));
  const data = await accountMgrAccessToken.json();
  
  var access_token : string = data.access_token;

  return access_token;
}

/** Get OAuth token from account manager for OCAPI*/

export async function getAccessTokenFromAccountManagerOCAPI() {
  const credentials = `${process.env.SFCC_AM_ID_OCAPI}:${process.env.SFCC_AM_SECRET_OCAPI}`;
  const base64data = Buffer.from(credentials).toString("base64");
  const OAuthBaseUrl = `https://account.demandware.com:443/dw/oauth2/access_token`;
  const headers = {
    'Authorization': `Basic ${base64data}`,
    'Content-Type' : 'application/x-www-form-urlencoded',
  };
  const body = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const accountMgrAccessToken : any = await fetch(OAuthBaseUrl, {
    method: 'POST',
    headers,
    body: body.toString()
  })
  .then((accountMgrAccessToken) => {
    console.log("Account Manager Access Token OCAPI:", accountMgrAccessToken);
    return accountMgrAccessToken;
  })
  .catch(error => console.log("Error fetching access token for account manager (OCAPI): ", error));
  const data = await accountMgrAccessToken.json();
		
  var access_token : string = data.access_token;

  return access_token;
}

/** Get guest customer Shopper Token (JWT) */

export async function getGuestTokenResponse() {
  try {
    const code_verifier = await generateRandomString(128);
    const code_challenge = await generateCodeChallenge(code_verifier);

    // 1. Get a SLAS `code`
    const authOptions = {
      headers: {
        "Content-Type": `application/x-www-form-urlencoded`,
      },
      parameters: {
        redirect_uri: process.env.REDIRECT_URI,
        response_type: "code",
        client_id: process.env.SFDC_PUBLIC_CLIENT_ID,
        code_challenge: code_challenge,
        hint: "guest",
        organizationId: clientConfig.parameters.organizationId,
      },
    }

    const loginClient = new Customer.ShopperLogin(clientConfig); // Initialize ShopperLogin client
    const authResponse = await loginClient.authorizeCustomer(authOptions, true);

    if (authResponse.status != 303) {
      const errorBody = await authResponse.text()
      console.log({ errorBody })
      throw authResponse
    }

    const response = await authResponse;
    const { usid, code } = Object.fromEntries(new URL(response.headers.get("location")).searchParams);

    // pass the code and usid to /token and get the access_token
    const tokenOptions = {
      body: {
        client_id: process.env.SFDC_PUBLIC_CLIENT_ID,
        code_verifier: code_verifier,
        code: code,
        grant_type: 'authorization_code_pkce',
        redirect_uri: process.env.REDIRECT_URI,
        usid: usid,
        channel_id: clientConfig.parameters.siteId,
      },
    };

    const tokenResponse = await loginClient.getAccessToken(tokenOptions);

    if (tokenResponse.hasOwnProperty('status_code')) {
      throw new Error(`Token exchange failed: ${tokenResponse}`);
    }

    return tokenResponse;
  } catch (error) {
    console.error('Error during guest token exchange', error);
    throw error;
  }
}

/** Get guest customer Shopper Token (JWT) */

export async function getShopperTokenResponse(options) {
  try {
    const code_verifier = await generateRandomString(128);
    const code_challenge = await generateCodeChallenge(code_verifier);

    const {username, password} = {
      username: options.username ? options.username : null,
      password: options.password ? options.password : null,
    };

    const credentials = `${username}:${password}`;
    const base64data = Buffer.from(credentials).toString("base64");

    // 1. Get a SLAS `code`
    const authOptions = {
      headers: {
        Authorization: `Basic ${base64data}`
      },
      body: {
        redirect_uri: process.env.REDIRECT_URI,
        client_id: clientConfig.parameters.clientId,
        code_challenge: code_challenge,
        organizationId: clientConfig.parameters.organizationId,
        channel_id: clientConfig.parameters.siteId,
        usid: options.usid ? options.usid : null,
      },
    }

    const loginClient = new Customer.ShopperLogin(clientConfig); // Initialize ShopperLogin client
    const authResponse = await loginClient.authenticateCustomer(authOptions, true);
    
    if (authResponse.status != 303) {
      const errorBody = await authResponse.text()
      console.log({ errorBody })
      throw authResponse
    }

    const response = await authResponse;
    // 2) Exchange the code for `access_token`

    const { usid, code } = Object.fromEntries(new URL(response.headers.get("location")).searchParams);

    // pass the code and usid to /token and get the access_token
    const tokenOptions = {
      headers: {
        Authorization: `Basic ${await basicAuthorization()}`,
      },
      body: {
        client_id: clientConfig.parameters.clientId,
        code_verifier: code_verifier,
        code: code,
        grant_type: 'authorization_code_pkce',
        redirect_uri: process.env.REDIRECT_URI,
        usid: usid,
        channel_id: clientConfig.parameters.siteId,
      },
    };

    const tokenResponse = await loginClient.getAccessToken(tokenOptions);

    if (tokenResponse.hasOwnProperty('status_code')) {
      throw new Error(`Token exchange failed: ${tokenResponse}`);
    }

    return tokenResponse;
  } catch (error) {
    console.error('Error during guest token exchange', error);
    throw error;
  }
}

/** Get Refresh Shopper Token (JWT) */

export async function getRefereshTokenResponse(refreshToken: string) {
  try {
    /** Get the session object
     * compare expiresAt with the current time
     * refresh the token if needed, otherwise don't change
     * update the session object, if the refresh token has been generated 
     */
    const loginClient = new Customer.ShopperLogin(clientConfig); // Initialize ShopperLogin client
    const authOptions = {
      headers: {
        Authorization: `Basic ${await basicAuthorization()}`
      },
      body: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
    }

    const tokenResponse = await loginClient.getAccessToken(authOptions);

    if (tokenResponse.hasOwnProperty('status_code')) {
      throw new Error(`Refresh Token Failed: ${tokenResponse}`);
    }

    return tokenResponse;
  } catch (error) {
    console.error('Error during refresh token creation', error);
    throw error;
  }
}